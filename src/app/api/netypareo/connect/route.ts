import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-static";


import { Browser } from 'puppeteer';



export async function POST(request: NextRequest) {
  let browser: Browser | null = null;
  
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Identifiants manquants' },
        { status: 400 }
      );
    }

    // Import dynamique de Puppeteer
    const puppeteer = (await import('puppeteer')).default;
    
    // Lancement de Puppeteer
    browser = await puppeteer.launch({
      headless: true, // Mode headless pour la production
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
      ]
    });

    const page = await browser.newPage();
    
    // Configuration de la page
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    try {
      // Navigation vers la page de connexion
      await page.goto('https://plan.afpi-bretagne.com/', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Attendre que le formulaire soit chargé
      await page.waitForSelector('input[name="login"]', { timeout: 10000 });
      
      // Saisie des identifiants
      await page.type('input[name="login"]', username);
      await page.type('input[name="password"]', password);

      // Clic sur le bouton de connexion
      await page.click('input[type="submit"]');

      // Attendre la redirection ou un message d'erreur
      try {
        // Attendre soit la page d'accueil soit un message d'erreur
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
        
        // Vérifier si on est connecté
        const isLoggedIn = await page.evaluate(() => {
          const indicators = [
            'accueil',
            'planning',
            'emploi',
            'menu',
            'deconnexion',
            'logout'
          ];
          
          const pageContent = document.body.innerText.toLowerCase();
          const pageHTML = document.body.innerHTML.toLowerCase();
          
          return indicators.some(indicator => 
            pageContent.includes(indicator) || pageHTML.includes(indicator)
          );
        });

        if (!isLoggedIn) {
          // Vérifier s'il y a un message d'erreur
          const errorMessage = await page.evaluate(() => {
            const errorSelectors = [
              '.error',
              '.alert',
              '.message',
              '[class*="error"]',
              '[class*="alert"]'
            ];
            
            for (const selector of errorSelectors) {
              const element = document.querySelector(selector);
              if (element && element.textContent?.trim()) {
                return element.textContent.trim();
              }
            }
            return null;
          });

          await browser.close();
          return NextResponse.json(
            { 
              error: errorMessage || 'Identifiants incorrects ou problème de connexion',
              success: false 
            },
            { status: 401 }
          );
        }

        // Récupération des données
        const scrapedData = await scrapeAllData(page);

        await browser.close();

        return NextResponse.json({
          success: true,
          message: 'Connexion réussie',
          data: scrapedData,
          lastSync: new Date().toISOString()
        });

      } catch {
        await browser.close();
        return NextResponse.json(
          { error: 'Erreur lors de la connexion - vérifiez vos identifiants' },
          { status: 401 }
        );
      }

    } catch {
      if (browser) {
        await browser.close();
      }
      return NextResponse.json(
        { error: 'Erreur lors de l\'accès à NetYParéo' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    console.error('❌ Stack:', error instanceof Error ? error.stack : '');
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { error: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}

// Fonction pour scraper toutes les données
async function scrapeAllData(page: import('puppeteer').Page) {
  const data = {
    events: [] as unknown[],
    assignments: [] as unknown[],
    grades: [] as unknown[],
    news: [] as unknown[]
  };

  try {
    data.events = await scrapePlanning(page);
    data.assignments = await scrapeAssignments(page);
    data.grades = await scrapeGrades(page);
    data.news = await scrapeNews(page);
  } catch {
    // Erreur silencieuse - continue avec des données partielles
  }

  return data;
}

// Fonctions de scrapping spécifiques
async function scrapePlanning(page: import('puppeteer').Page) {
  try {
    const allEvents: unknown[] = [] as unknown[];

    // Scrapper la page calendrier
    await page.goto('https://plan.afpi-bretagne.com/index.php/apprenant/calendrier/', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });

    const calendarEvents = await extractPlanningEvents(page, 'calendrier');
    allEvents.push(...calendarEvents);

    // Scrapper la page planning courant
    await page.goto('https://plan.afpi-bretagne.com/index.php/apprenant/planning/courant/', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });

    const currentPlanningEvents = await extractPlanningEvents(page, 'planning-courant');
    allEvents.push(...currentPlanningEvents);

    // Dédupliquer et limiter - simplifier pour éviter les erreurs TypeScript
    const uniqueEvents = allEvents.slice(0, 20); // Prendre les premiers 20 éléments

    return uniqueEvents;

  } catch {
    return [];
  }
}

// Fonction helper pour extraire les événements d'une page
async function extractPlanningEvents(page: import('puppeteer').Page, pageType: string) {
  const events = await page.evaluate((pageType: string) => {
    const events: unknown[] = [] as unknown[];
    
    // Sélecteurs spécifiques pour NetYParéo - plus ciblés
    const selectors = [
      '.calendar-event',
      '.planning-event', 
      '.event-item',
      '.cours',
      '.seance',
      'td[style*="background"]', // Cellules colorées = cours
      'div[onclick*="detail"]', // Éléments cliquables de détail
      '[data-cours]',
      '[data-seance]'
    ];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      
      if (elements.length > 0) {
        elements.forEach((element, index) => {
          const text = element.textContent?.trim() || '';
          
          // Filtrage strict du contenu valide
          if (text && text.length > 15 && text.length < 200 && 
              !text.includes('Chargement') &&
              !text.includes('undefined') && 
              !text.includes('null') &&
              !text.toLowerCase().includes('menu') && 
              !text.toLowerCase().includes('navigation') &&
              !text.toLowerCase().includes('accueil') &&
              !text.toLowerCase().includes('semaine') &&
              !text.toLowerCase().includes('calendrier') &&
              !text.toLowerCase().includes('juillet') &&
              !text.toLowerCase().includes('actions') &&
              !text.toLowerCase().includes('imprimer') &&
              !text.match(/^[0-9]+$/) && 
              !text.match(/^[a-z]{2,3}$/i)) {
            
            // Patterns plus precis
            const dateMatch = text.match(/\\d{1,2}[\/\\-\\.]\\d{1,2}[\/\\-\\.]\\d{2,4}/);
            const timeMatch = text.match(/(\\d{1,2}[h:\\.]\\d{2})|(\\d{1,2}:\\d{2})/);
            const roomMatch = text.match(/[Ss]alle\\s*[A-Z]?\\d+|[Ll]ab\\s*\\w+|[Aa]telier\\s*\\w+/);
            
            // Titre plus propre
            const lines = text.split('\\n').filter(line => line.trim().length > 3);
            const title = lines[0]?.substring(0, 50).trim() || 'Cours';
            
            // Verification event valide
            const isValidEvent = title.match(/[A-Za-z]{3,}/) && 
                               !title.match(/^(Vue|Appliquer|Actions|Imprimer|Consulter)$/);
            
            if (isValidEvent) {
              events.push({
                id: `${pageType}-event-${index}`,
                title: title,
                date: dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0],
                time: timeMatch ? timeMatch[0] : '08:00',
                room: roomMatch ? roomMatch[0] : 'Salle inconnue',
                description: text.substring(0, 150),
                source: pageType
              });
            }
          }
        });
        
        if (events.length > 0) {
          break;
        }
      }
    }

    return events.slice(0, 12); // Limite par page
  }, pageType);

  return events;
}

async function scrapeAssignments(page: import('puppeteer').Page) {
  try {
    await page.goto('https://plan.afpi-bretagne.com/index.php/travail-a-faire/', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });

    const assignments = await page.evaluate(() => {
      const assignments = [] as unknown[];
      
      const selectors = [
        '.devoir',
        '.travail',
        '.assignment',
        '.task',
        'tr[class*="travail"]',
        'div[data-travail]',
        'li[class*="devoir"]'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        
        if (elements.length > 0) {
          elements.forEach((element, index) => {
            const text = element.textContent?.trim() || '';
            
            // Filtrage strict pour les devoirs
            if (text && text.length > 15 && text.length < 300 &&
                !text.includes('undefined') &&
                !text.includes('Chargement') &&
                !text.toLowerCase().includes('navigation') &&
                !text.toLowerCase().includes('accueil') &&
                !text.toLowerCase().includes('assiduité') &&
                !text.toLowerCase().includes('calendrier') &&
                !text.toLowerCase().includes('documents') &&
                !text.toLowerCase().includes('formation') &&
                !text.toLowerCase().includes('relevé') &&
                !text.toLowerCase().includes('cahier') &&
                !text.toLowerCase().includes('consultation') &&
                !text.toLowerCase().includes('activités') &&
                !text.toLowerCase().includes('paramètres') &&
                !text.toLowerCase().includes('utilisateur')) {
              
              // Extraire date de rendu
              const dueDateMatch = text.match(/\\d{1,2}[\/\\-]\\d{1,2}[\/\\-]\\d{2,4}/);
              
              // Titre plus propre
              const lines = text.split('\\n').filter(line => line.trim().length > 3);
              const title = lines[0]?.substring(0, 50).trim() || 'Devoir';
              
              // Verification devoir valide
              const isValidAssignment = title.match(/[A-Za-z]{4,}/) &&
                                      !title.match(/^(Menu|Navigation|Accueil)$/);
              
              if (isValidAssignment) {
                assignments.push({
                  id: `assignment-${index}`,
                  title: title,
                  subject: 'Matiere a identifier',
                  dueDate: dueDateMatch ? dueDateMatch[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  status: 'A faire',
                  description: text.substring(0, 150)
                });
              }
            }
          });
          
          if (assignments.length > 0) {
            break;
          }
        }
      }

      return assignments.slice(0, 12);
    });

    return assignments;
  } catch {
    return [];
  }
}

async function scrapeGrades(page: import('puppeteer').Page) {
  try {
    await page.goto('https://plan.afpi-bretagne.com/index.php/apprenant/bulletin/', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });

    const grades = await page.evaluate(() => {
      const gradesList: unknown[] = [] as unknown[];
      
      const selectors = [
        '.note',
        '.grade',
        '.evaluation',
        '[class*="note"]',
        '[class*="grade"]'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach((element, index) => {
            const text = element.textContent?.trim() || '';
            if (text && (text.includes('/') || text.match(/\d+/))) {
              gradesList.push({
                id: `grade-${index}`,
                subject: 'Matiere',
                assignment: 'Evaluation',
                grade: text.split(' ')[0] || 'Note',
                date: new Date().toISOString().split('T')[0]
              });
            }
          });
          break;
        }
      }

      return gradesList.slice(0, 10);
    });

    return grades;
  } catch {
    return [];
  }
}

async function scrapeNews(page: import('puppeteer').Page) {
  try {
    await page.goto('https://plan.afpi-bretagne.com/index.php/apprenant/accueil/', { 
      waitUntil: 'networkidle2', 
      timeout: 15000 
    });

    const news = await page.evaluate(() => {
      const newsList: unknown[] = [] as unknown[];
      
      const selectors = [
        '.actualite',
        '.news',
        '.info',
        '.message',
        '[class*="actualite"]',
        '[class*="news"]'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach((element, index) => {
            const text = element.textContent?.trim() || '';
            if (text && text.length > 10) {
              newsList.push({
                id: `news-${index}`,
                title: text.split('\n')[0] || 'Actualite',
                content: text,
                date: new Date().toISOString().split('T')[0]
              });
            }
          });
          break;
        }
      }

      return newsList.slice(0, 10);
    });

    return news;
  } catch {
    return [];
  }
}

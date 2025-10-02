import { NextRequest, NextResponse } from 'next/server';
export const dynamic = "force-dynamic";


import Tesseract from 'tesseract.js';



interface ScheduleItem {
  time: string;
  title: string;
  location?: string;
  day: string;
}

function parseScheduleText(text: string): ScheduleItem[] {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const scheduleItems: ScheduleItem[] = [];
  
  const timeRegex = /(\d{1,2})[h:](\d{2})/;
  const dayRegex = /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i;
  
  let currentDay = '';
  
  for (const line of lines) {
    const cleanLine = line.trim();
    
    // Détecter les jours
    const dayMatch = cleanLine.match(dayRegex);
    if (dayMatch) {
      currentDay = dayMatch[1].toLowerCase();
      continue;
    }
    
    // Détecter les horaires et cours
    const timeMatch = cleanLine.match(timeRegex);
    if (timeMatch && currentDay) {
      const hour = timeMatch[1].padStart(2, '0');
      const minute = timeMatch[2];
      const time = `${hour}:${minute}`;
      
      // Extraire le titre du cours (après l'horaire)
      const titleMatch = cleanLine.replace(timeRegex, '').trim();
      
      if (titleMatch) {
        // Séparer titre et lieu si possible
        const parts = titleMatch.split(/[-–]|\s+salle\s+/i);
        const title = parts[0].trim();
        const location = parts[1]?.trim();
        
        scheduleItems.push({
          time,
          title,
          location,
          day: currentDay
        });
      }
    }
  }
  
  return scheduleItems;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'Aucune image fournie' }, { status: 400 });
    }
    
    // Convertir l'image en buffer
    const imageBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Traitement OCR avec Tesseract
    const result = await Tesseract.recognize(buffer, 'fra', {
      logger: m => console.log(m) // Log pour debug
    });
    
    const extractedText = result.data.text;
    console.log('Texte extrait:', extractedText);
    
    // Parser le texte pour extraire les informations du planning
    const scheduleItems = parseScheduleText(extractedText);
    
    return NextResponse.json({
      success: true,
      text: extractedText,
      scheduleItems,
      confidence: result.data.confidence
    });
    
  } catch (error) {
    console.error('Erreur OCR:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement OCR' },
      { status: 500 }
    );
  }
}

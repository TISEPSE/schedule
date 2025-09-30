# Design System Guidelines - Schedule App

## Corrections apportées et standards établis

### 1. **Problèmes DOM corrigés** ✅

#### Erreurs `validateDOMNesting` éliminées :
- **Boutons imbriqués** : Remplacés par des `<div>` avec `role="button"` et support clavier
- **Éléments interactifs imbriqués** : Restructurés pour éviter les nested interactive elements
- **Accordéons** : Utilisation de div cliquables au lieu de buttons imbriqués

#### Exemples de corrections :
```tsx
// ❌ AVANT - Invalid nesting
<button onClick={toggleExpanded}>
  <button onClick={toggleStepExpanded}>
    <ChevronUp />
  </button>
</button>

// ✅ APRÈS - Valid structure
<div 
  onClick={toggleExpanded}
  role="button"
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className="cursor-pointer focus-within:ring-2"
>
  <div onClick={toggleStepExpanded} role="button">
    <ChevronUp />
  </div>
</div>
```

### 2. **Palette de couleurs standardisée** 🎨

#### Couleurs principales harmonisées :
- **Grays** : `gray-*` (au lieu de `slate-*`)
- **Success/Completion** : `green-*` (au lieu de `emerald-*`)
- **Warning/Medium Priority** : `yellow-*` (au lieu de `orange-*` pour labels)
- **Error/High Priority** : `red-*` (au lieu de `rose-*`)
- **Info/Progress** : `blue-*` (cohérent)
- **Special Actions** : `orange-*` (pour "en cours" uniquement)
- **Categories** : `purple-*` (cohérent)

#### Mapping des couleurs par usage :
```tsx
const colorSystem = {
  // États des projets
  completed: 'text-green-700',
  inProgress: 'text-blue-700', 
  overdue: 'text-red-600',
  notStarted: 'text-gray-500',
  
  // Priorités
  high: 'bg-red-100 text-red-600',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
  
  // Catégories
  career: 'bg-blue-100 text-blue-700',
  learning: 'bg-green-100 text-green-700',
  health: 'bg-red-100 text-red-600',
  personal: 'bg-purple-100 text-purple-700',
  financial: 'bg-yellow-100 text-yellow-700'
};
```

### 3. **Composants UI standardisés** 🧩

#### Cards (suivant le pattern StatsCard) :
```tsx
const StandardCard = {
  container: "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300",
  title: "text-base font-medium text-gray-600 mb-1",
  value: "text-3xl font-bold text-gray-900 mb-1",
  icon: "p-3 rounded-lg transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
};
```

#### Boutons :
```tsx
const ButtonStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
  secondary: "text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200",
  danger: "bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
};
```

#### Checkboxes/Toggle buttons :
```tsx
const ToggleStyles = {
  completed: "bg-green-500 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow",
  uncompleted: "border-2 border-gray-300 rounded-full hover:border-green-500 transition-all bg-white hover:shadow-sm"
};
```

### 4. **Accessibilité améliorée** ♿

#### Standards appliqués :
- **Focus states** : `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`
- **Touch targets** : Min 44px sur mobile (défini dans mobile.css)
- **Keyboard navigation** : Support Enter/Space pour tous les éléments cliquables
- **Screen readers** : Attributs `role`, `tabIndex`, `title` appropriés
- **Color contrast** : Respecte les standards WCAG AA

#### Exemple d'élément accessible :
```tsx
<div
  onClick={handleClick}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
  aria-label="Toggle project expansion"
>
```

### 5. **Responsiveness optimisée** 📱

#### Classes mobile harmonisées :
- `mobile-project-card` : Padding réduit sur mobile
- `mobile-modal` : Margins adaptées aux écrans mobiles  
- `xs-mobile-modal` : Optimisations pour très petits écrans
- `mobile-button-group` : Disposition verticale sur mobile

#### Breakpoints standardisés :
```css
/* Mobile first approach */
@media (max-width: 480px) { /* xs-mobile */ }
@media (max-width: 768px) { /* mobile */ }
@media (max-width: 1024px) { /* tablet */ }
```

### 6. **Animations cohérentes** ✨

#### Micro-interactions standardisées :
- **Hover effects** : `hover:scale-[1.02]` pour les cards
- **Button hovers** : `hover:shadow-lg` + subtle scale
- **Icon animations** : `group-hover:scale-110 group-hover:rotate-3`
- **Transitions** : `transition-all duration-300` (300ms standard)

#### Animations d'état :
- **Task completion** : `animate-task-complete` (0.6s)
- **Milestone completion** : `animate-milestone-complete` (0.8s)  
- **Modal entrance** : `animate-fade-in-up` (0.3s)
- **Accordion expansion** : `animate-slide-down` (0.4s)

### 7. **Recommandations UX/UI** 🎯

#### Améliorations implémentées :
1. **Visual hierarchy** : Typography cohérente (text-xl/text-2xl pour titres)
2. **Information density** : Spacing optimisé (p-4/p-6 standardisé)
3. **Loading states** : Animations pendant les actions (toggle, complete)
4. **Error prevention** : Confirmations pour actions destructives
5. **Progressive disclosure** : Accordéons pour éviter la surcharge cognitive

#### Patterns d'interaction :
- **Single expansion** : Un seul accordéon ouvert à la fois dans les modals
- **Multi-expansion** : Accordéons indépendants dans la vue principale
- **Batch actions** : Toggle d'étape complète toutes les tâches
- **Contextual actions** : Boutons d'action dans les hover states

### 8. **Guidelines pour les développements futurs** 🔮

#### Quand ajouter de nouveaux composants :
1. **Suivre la palette de couleurs** établie (gray/blue/green/red/yellow/orange/purple)
2. **Respecter les patterns d'accessibilité** (focus, keyboard, screen readers)
3. **Utiliser les classes de base** définies (cards, buttons, inputs)
4. **Maintenir la cohérence responsive** (mobile-first, touch targets)
5. **Implémenter les micro-animations** appropriées

#### Structure recommandée pour nouveaux composants :
```tsx
const NewComponent = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Titre</h3>
      <p className="text-gray-700 mb-4">Description</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg">
        Action
      </button>
    </div>
  );
};
```

## Résumé des bénéfices obtenus

✅ **Erreurs DOM éliminées** - Plus de `validateDOMNesting` warnings  
✅ **Design system cohérent** - Couleurs et styles harmonisés  
✅ **Accessibilité améliorée** - Support complet keyboard/screen readers  
✅ **Performance optimisée** - Transitions fluides et animations appropriées  
✅ **Maintenabilité** - Code plus propre et patterns réutilisables  
✅ **UX optimisée** - Interactions intuitives et feedback visuel  

---

*Ce document doit être maintenu à jour lors de chaque évolution du design system de l'application.*
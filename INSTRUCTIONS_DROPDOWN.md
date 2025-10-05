# Instructions pour intégrer les dropdowns personnalisés

## Étapes d'intégration

### 1. Ajouter le script dropdown.js dans index.html

Ouvrez `index.html` et trouvez cette ligne (vers la ligne 4569):
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

Ajoutez JUSTE AVANT cette ligne:
```html
<script src="dropdown.js"></script>
```

Le résultat devrait être:
```html
<script src="dropdown.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### 2. C'est tout !

Le script `dropdown.js` transformera automatiquement TOUS les éléments `<select class="form-control">` en dropdowns personnalisés avec popup.

## Fonctionnalités

✅ **Transformation automatique** - Tous les selects sont convertis automatiquement
✅ **Recherche intégrée** - Pour les dropdowns avec plus de 5 options
✅ **Icônes** - Icônes automatiques pour les catégories connues
✅ **Animation fluide** - Ouverture/fermeture avec animation
✅ **Responsive** - Adapté aux mobiles
✅ **Compatible** - Fonctionne avec votre code JavaScript existant

## Utilisation dans le code

Le code existant continue de fonctionner normalement:

```javascript
// Récupérer la valeur
const category = document.getElementById('productCategory').value;

// Définir la valeur
document.getElementById('productCategory').value = 'ordinateur';

// Événement change fonctionne normalement
document.getElementById('productCategory').addEventListener('change', function() {
    console.log(this.value);
});
```

## API supplémentaire (optionnelle)

Si vous voulez contrôler les dropdowns directement:

```javascript
// Définir une valeur
dropdownManager.setValue('productCategory', 'telephone');

// Récupérer une valeur
const value = dropdownManager.getValue('productCategory');

// Réinitialiser
dropdownManager.reset('productCategory');
```

## Styles CSS

Les styles CSS ont déjà été ajoutés dans la section `<style>` du fichier index.html (lignes 408-558).

## Test

1. Ouvrez index.html dans votre navigateur
2. Cliquez sur "Ajouter un produit" ou "Nouvelle vente"
3. Les dropdowns devraient maintenant être des popups personnalisés avec icônes
4. Testez la sélection d'une catégorie
5. Vérifiez que la sauvegarde fonctionne normalement

## Dropdowns concernés

Tous les selects suivants seront transformés:
- ✅ Catégorie produit (modal ajout/édition)
- ✅ Sélection produit (modal vente)
- ✅ Filtres de période (archives)
- ✅ Filtres de type de données (archives)
- ✅ Filtres de catégorie (stock)
- ✅ Filtres de statut (stock)

## En cas de problème

Si les dropdowns ne s'affichent pas:
1. Vérifiez que `dropdown.js` est bien dans le même dossier que `index.html`
2. Vérifiez que le script est bien chargé (F12 > Console)
3. Vérifiez qu'il n'y a pas d'erreurs JavaScript dans la console

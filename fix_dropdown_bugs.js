// ========================================
// CORRECTIF POUR LES BUGS DES DROPDOWNS
// ========================================
// Ce script corrige 2 bugs:
// 1. Produits ne s'affichent pas dans "Nouvelle vente"
// 2. Nouvelles catégories n'apparaissent pas dans les dropdowns

// SOLUTION: Rafraîchir les dropdowns après le chargement des données

// ========================================
// CORRECTIF 1: Rafraîchir le dropdown des produits après populateProductsDropdown()
// ========================================

// Sauvegarder la fonction originale
const originalPopulateProductsDropdown = window.populateProductsDropdown;

// Remplacer par une version améliorée
window.populateProductsDropdown = function() {
    // Appeler la fonction originale
    if (originalPopulateProductsDropdown) {
        originalPopulateProductsDropdown();
    }
    
    // Rafraîchir le dropdown après le chargement des produits
    setTimeout(() => {
        if (window.dropdownManager) {
            dropdownManager.refresh('saleProduct');
        }
    }, 100);
};

// ========================================
// CORRECTIF 2: Rafraîchir les dropdowns de catégories après ajout
// ========================================

// Sauvegarder la fonction originale saveProduct
const originalSaveProduct = window.saveProduct;

// Remplacer par une version améliorée
window.saveProduct = function() {
    // Appeler la fonction originale
    if (originalSaveProduct) {
        originalSaveProduct();
    }
    
    // Rafraîchir tous les dropdowns de catégories
    setTimeout(() => {
        if (window.dropdownManager) {
            dropdownManager.refresh('productCategory');
            dropdownManager.refresh('editProductCategory');
            dropdownManager.refresh('archiveCategory');
            dropdownManager.refresh('stockCategoryFilter');
        }
    }, 100);
};

// ========================================
// CORRECTIF 3: Observer les changements dans les select
// ========================================

// Observer les modifications du DOM pour détecter les changements dans les <select>
const selectObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                // Si c'est un <option> ajouté à un <select>
                if (node.nodeName === 'OPTION' && mutation.target.nodeName === 'SELECT') {
                    const selectId = mutation.target.id;
                    if (selectId && window.dropdownManager) {
                        // Rafraîchir le dropdown correspondant
                        setTimeout(() => {
                            dropdownManager.refresh(selectId);
                        }, 50);
                    }
                }
            });
        }
        // Si le contenu d'un select change
        if (mutation.type === 'characterData' && mutation.target.parentNode.nodeName === 'OPTION') {
            const select = mutation.target.parentNode.parentNode;
            if (select && select.nodeName === 'SELECT' && select.id && window.dropdownManager) {
                setTimeout(() => {
                    dropdownManager.refresh(select.id);
                }, 50);
            }
        }
    });
});

// Démarrer l'observation après le chargement de la page
setTimeout(() => {
    const selects = document.querySelectorAll('select.form-control');
    selects.forEach(select => {
        selectObserver.observe(select, {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
}, 1000);

// ========================================
// CORRECTIF 4: Fonction utilitaire pour forcer le rafraîchissement
// ========================================

window.refreshAllDropdowns = function() {
    if (window.dropdownManager) {
        const dropdownIds = [
            'productCategory',
            'editProductCategory',
            'saleProduct',
            'archivePeriod',
            'archiveDataType',
            'archiveCategory',
            'stockCategoryFilter',
            'stockStatusFilter'
        ];
        
        dropdownIds.forEach(id => {
            if (document.getElementById(id)) {
                dropdownManager.refresh(id);
            }
        });
    }
};


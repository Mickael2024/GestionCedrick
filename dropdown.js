// Système de dropdown personnalisé
class CustomDropdown {
    constructor(selectElement) {
        this.selectElement = selectElement;
        this.selectedValue = selectElement.value;
        this.options = Array.from(selectElement.options);
        this.isOpen = false;
        
        this.createDropdown();
        this.attachEvents();
    }
    
    createDropdown() {
        // Créer le conteneur du dropdown
        this.container = document.createElement('div');
        this.container.className = 'custom-dropdown';
        this.container.id = this.selectElement.id + 'Dropdown';
        
        // Créer l'élément sélectionné
        this.selectedDiv = document.createElement('div');
        this.selectedDiv.className = 'dropdown-selected';
        this.selectedDiv.setAttribute('data-value', this.selectedValue);
        
        const selectedText = document.createElement('span');
        selectedText.className = this.selectedValue ? 'selected-text' : 'selected-text placeholder';
        selectedText.textContent = this.getSelectedText();
        
        const arrow = document.createElement('i');
        arrow.className = 'fas fa-chevron-down dropdown-arrow';
        
        this.selectedDiv.appendChild(selectedText);
        this.selectedDiv.appendChild(arrow);
        
        // Créer le menu dropdown
        this.menu = document.createElement('div');
        this.menu.className = 'dropdown-menu';
        
        // Ajouter une barre de recherche si plus de 5 options
        if (this.options.length > 5) {
            const searchDiv = document.createElement('div');
            searchDiv.className = 'dropdown-search';
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Rechercher...';
            searchInput.addEventListener('input', (e) => this.filterOptions(e.target.value));
            searchDiv.appendChild(searchInput);
            this.menu.appendChild(searchDiv);
        }
        
        // Ajouter les options (avec support des optgroups)
        this.buildOptionsFromSelect();
        
        // Assembler le dropdown
        this.container.appendChild(this.selectedDiv);
        this.container.appendChild(this.menu);
        
        // Remplacer le select par le dropdown
        this.selectElement.style.display = 'none';
        this.selectElement.parentNode.insertBefore(this.container, this.selectElement);
    }
    
    buildOptionsFromSelect() {
        // Parcourir les enfants du select (options et optgroups)
        Array.from(this.selectElement.children).forEach(child => {
            if (child.tagName === 'OPTGROUP') {
                // Ajouter un séparateur de catégorie
                const categoryHeader = document.createElement('div');
                categoryHeader.className = 'dropdown-category-header';
                categoryHeader.innerHTML = `<i class="fas fa-folder"></i> ${child.label}`;
                this.menu.appendChild(categoryHeader);
                
                // Ajouter les options du groupe
                Array.from(child.children).forEach(option => {
                    if (option.value === '') return;
                    this.createOptionElement(option);
                });
            } else if (child.tagName === 'OPTION') {
                // Option sans groupe
                if (child.value === '') return;
                this.createOptionElement(child);
            }
        });
    }
    
    createOptionElement(option) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'dropdown-option';
        optionDiv.setAttribute('data-value', option.value);
        
        // Ajouter les attributs data personnalisés
        Array.from(option.attributes).forEach(attr => {
            if (attr.name.startsWith('data-')) {
                optionDiv.setAttribute(attr.name, attr.value);
            }
        });
        
        // Ajouter une icône si c'est une catégorie
        const icon = this.getIconForOption(option.value);
        if (icon) {
            const iconElement = document.createElement('i');
            iconElement.className = `${icon} option-icon`;
            optionDiv.appendChild(iconElement);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = option.text;
        optionDiv.appendChild(textSpan);
        
        if (option.value === this.selectedValue) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.addEventListener('click', () => this.selectOption(option.value, option.text));
        
        this.menu.appendChild(optionDiv);
    }
    
    getSelectedText() {
        const selectedOption = this.options.find(opt => opt.value === this.selectedValue);
        return selectedOption ? selectedOption.text : this.options[0].text;
    }
    
    getIconForOption(value) {
        const iconMap = {
            'ordinateur': 'fas fa-laptop',
            'telephone': 'fas fa-mobile-alt',
            'tablette': 'fas fa-tablet-alt',
            'accessoire': 'fas fa-plug',
            'all': 'fas fa-list',
            'today': 'fas fa-calendar-day',
            'week': 'fas fa-calendar-week',
            'month': 'fas fa-calendar-alt',
            'year': 'fas fa-calendar',
            'products': 'fas fa-box',
            'sales': 'fas fa-shopping-cart',
            'normal': 'fas fa-check-circle',
            'low': 'fas fa-exclamation-triangle',
            'out': 'fas fa-times-circle'
        };
        return iconMap[value] || null;
    }
    
    attachEvents() {
        // Toggle dropdown
        this.selectedDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Fermer si on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    open() {
        // Fermer tous les autres dropdowns
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-selected.active').forEach(selected => {
            selected.classList.remove('active');
        });
        
        this.menu.classList.add('show');
        this.selectedDiv.classList.add('active');
        this.isOpen = true;
    }
    
    close() {
        this.menu.classList.remove('show');
        this.selectedDiv.classList.remove('active');
        this.isOpen = false;
    }
    
    selectOption(value, text) {
        this.selectedValue = value;
        this.selectElement.value = value;
        
        // Mettre à jour l'affichage
        const selectedText = this.selectedDiv.querySelector('.selected-text');
        selectedText.textContent = text;
        selectedText.classList.remove('placeholder');
        
        this.selectedDiv.setAttribute('data-value', value);
        
        // Mettre à jour les options sélectionnées
        this.menu.querySelectorAll('.dropdown-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.getAttribute('data-value') === value) {
                opt.classList.add('selected');
            }
        });
        
        // Déclencher l'événement change sur le select original
        const event = new Event('change', { bubbles: true });
        this.selectElement.dispatchEvent(event);
        
        this.close();
    }
    
    filterOptions(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.menu.querySelectorAll('.dropdown-option').forEach(option => {
            const text = option.textContent.toLowerCase();
            if (text.includes(term)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }
    
    setValue(value) {
        const option = this.options.find(opt => opt.value === value);
        if (option) {
            this.selectOption(value, option.text);
        }
    }
    
    getValue() {
        return this.selectedValue;
    }
    
    reset() {
        this.selectOption('', this.options[0].text);
        const selectedText = this.selectedDiv.querySelector('.selected-text');
        selectedText.classList.add('placeholder');
    }
    
    refresh() {
        // Mettre à jour la liste des options depuis le select original
        this.options = Array.from(this.selectElement.options);
        
        // Vider et recréer le menu
        const searchDiv = this.menu.querySelector('.dropdown-search');
        this.menu.innerHTML = '';
        
        // Rajouter la recherche si nécessaire
        if (this.options.length > 5 && searchDiv) {
            this.menu.appendChild(searchDiv);
        } else if (this.options.length > 5) {
            const newSearchDiv = document.createElement('div');
            newSearchDiv.className = 'dropdown-search';
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Rechercher...';
            searchInput.addEventListener('input', (e) => this.filterOptions(e.target.value));
            newSearchDiv.appendChild(searchInput);
            this.menu.appendChild(newSearchDiv);
        }
        
        // Recréer les options avec support des groupes
        this.buildOptionsFromSelect();
    }
}

// Gestionnaire global des dropdowns
const dropdownManager = {
    dropdowns: new Map(),
    
    init() {
        this.convertAllSelects();
        
        // Observer pour les nouveaux selects ajoutés dynamiquement
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const selects = node.querySelectorAll ? node.querySelectorAll('select.form-control') : [];
                        selects.forEach(select => {
                            if (!this.dropdowns.has(select.id)) {
                                this.convertSelect(select);
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },
    
    convertAllSelects() {
        const selects = document.querySelectorAll('select.form-control');
        selects.forEach(select => this.convertSelect(select));
    },
    
    convertSelect(select) {
        if (select.id && !this.dropdowns.has(select.id)) {
            const dropdown = new CustomDropdown(select);
            this.dropdowns.set(select.id, dropdown);
        }
    },
    
    refreshDropdown(id) {
        const dropdown = this.dropdowns.get(id);
        if (dropdown) {
            // Détruire l'ancien dropdown
            dropdown.container.remove();
            this.dropdowns.delete(id);
            
            // Recréer le dropdown
            const select = document.getElementById(id);
            if (select) {
                select.style.display = '';
                this.convertSelect(select);
            }
        }
    },
    
    getDropdown(id) {
        return this.dropdowns.get(id);
    },
    
    setValue(id, value) {
        const dropdown = this.dropdowns.get(id);
        if (dropdown) {
            dropdown.setValue(value);
        }
    },
    
    getValue(id) {
        const dropdown = this.dropdowns.get(id);
        return dropdown ? dropdown.getValue() : null;
    },
    
    reset(id) {
        const dropdown = this.dropdowns.get(id);
        if (dropdown) {
            dropdown.reset();
        }
    },
    
    refresh(id) {
        const dropdown = this.dropdowns.get(id);
        if (dropdown) {
            dropdown.refresh();
        }
    }
};

// Initialiser au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => dropdownManager.init());
} else {
    dropdownManager.init();
}

// Exposer globalement pour utilisation dans le code existant
window.dropdownManager = dropdownManager;

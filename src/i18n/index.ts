import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Grid
      'grid.loading': 'Loading...',
      'grid.noData': 'No data available',
      'grid.rowsPerPage': 'Rows per page',
      'grid.of': 'of',
      'grid.page': 'Page',
      'grid.selected': 'selected',
      'grid.selectAll': 'Select all',
      'grid.clearSelection': 'Clear selection',
      
      // Columns
      'columns.hide': 'Hide column',
      'columns.show': 'Show column',
      'columns.pin': 'Pin column',
      'columns.unpin': 'Unpin column',
      'columns.resize': 'Resize column',
      'columns.sort': 'Sort',
      'columns.filter': 'Filter',
      
      // Filters
      'filter.equals': 'Equals',
      'filter.contains': 'Contains',
      'filter.startsWith': 'Starts with',
      'filter.endsWith': 'Ends with',
      'filter.greaterThan': 'Greater than',
      'filter.lessThan': 'Less than',
      'filter.between': 'Between',
      'filter.apply': 'Apply',
      'filter.clear': 'Clear',
      'filter.clearAll': 'Clear all filters',
      
      // Actions
      'actions.export': 'Export',
      'actions.print': 'Print',
      'actions.delete': 'Delete',
      'actions.edit': 'Edit',
      'actions.save': 'Save',
      'actions.cancel': 'Cancel',
      
      // Themes
      'theme.modernBlue': 'Modern Blue',
      'theme.darkSlate': 'Dark Slate',
      'theme.forestGreen': 'Forest Green',
      
      // Shortcuts
      'shortcuts.title': 'Keyboard Shortcuts',
      'shortcuts.selectAll': 'Select all rows',
      'shortcuts.clearSelection': 'Clear selection',
      'shortcuts.deleteSelected': 'Delete selected rows',
      'shortcuts.search': 'Focus search',
      'shortcuts.clearFilters': 'Clear all filters',
      'shortcuts.export': 'Export to PDF',
      'shortcuts.navigation': 'Page navigation'
    }
  },
  es: {
    translation: {
      'grid.loading': 'Cargando...',
      'grid.noData': 'No hay datos disponibles',
      'grid.rowsPerPage': 'Filas por página',
      'grid.of': 'de',
      'grid.page': 'Página',
      'grid.selected': 'seleccionado',
      'grid.selectAll': 'Seleccionar todo',
      'grid.clearSelection': 'Limpiar selección',
      
      'filter.equals': 'Igual',
      'filter.contains': 'Contiene',
      'filter.startsWith': 'Comienza con',
      'filter.endsWith': 'Termina con',
      'filter.greaterThan': 'Mayor que',
      'filter.lessThan': 'Menor que',
      'filter.between': 'Entre',
      'filter.apply': 'Aplicar',
      'filter.clear': 'Limpiar',
      'filter.clearAll': 'Limpiar todos los filtros',
      
      'actions.export': 'Exportar',
      'actions.print': 'Imprimir',
      'actions.delete': 'Eliminar',
      'actions.edit': 'Editar',
      'actions.save': 'Guardar',
      'actions.cancel': 'Cancelar',
      
      'theme.modernBlue': 'Azul Moderno',
      'theme.darkSlate': 'Pizarra Oscura',
      'theme.forestGreen': 'Verde Bosque'
    }
  },
  fr: {
    translation: {
      'grid.loading': 'Chargement...',
      'grid.noData': 'Aucune donnée disponible',
      'grid.rowsPerPage': 'Lignes par page',
      'grid.of': 'de',
      'grid.page': 'Page',
      'grid.selected': 'sélectionné',
      'grid.selectAll': 'Tout sélectionner',
      'grid.clearSelection': 'Effacer la sélection',
      
      'filter.equals': 'Égal',
      'filter.contains': 'Contient',
      'filter.startsWith': 'Commence par',
      'filter.endsWith': 'Se termine par',
      'filter.greaterThan': 'Plus grand que',
      'filter.lessThan': 'Plus petit que',
      'filter.between': 'Entre',
      'filter.apply': 'Appliquer',
      'filter.clear': 'Effacer',
      'filter.clearAll': 'Effacer tous les filtres',
      
      'actions.export': 'Exporter',
      'actions.print': 'Imprimer',
      'actions.delete': 'Supprimer',
      'actions.edit': 'Modifier',
      'actions.save': 'Sauvegarder',
      'actions.cancel': 'Annuler',
      
      'theme.modernBlue': 'Bleu Moderne',
      'theme.darkSlate': 'Ardoise Sombre',
      'theme.forestGreen': 'Vert Forêt'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
export const drawLocal = {
  draw: {
    toolbar: {
      actions: {
        title: 'Cancelar desenho',
        text: 'Cancelar',
      },
      finish: {
        title: 'Finalizar desenho',
        text: 'Finalizar',
      },
      undo: {
        title: 'Apagar último ponto desenhado',
        text: 'Apagar último ponto',
      },
      buttons: {
        polygon: 'Desenhe um poligono',
      },
    },
    handlers: {
      polygon: {
        tooltip: {
          start: 'Posicione o primeiro ponto da área.',
          cont: 'Posicione um ponto para continuar a demarcar uma área.',
          end: 'Toque no primeiro ponto para finalizar a área.',
        },
      },
      polyline: {
        error: '<strong>Atenção:<strong> você não pode fazer isso!',
      },
    },
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: 'Salvar mudanças',
          text: 'Salvar',
        },
        cancel: {
          title: 'Cancelar edição, descarta todas as mudanças.',
          text: 'Cancelar',
        },
        clearAll: {
          title: 'Apaga todas as layers.',
          text: 'Apagar tudo',
        },
      },
      buttons: {
        edit: 'Editar áreas',
        editDisabled: 'Sem áreas para editar',
        remove: 'Apagar áreas',
        removeDisabled: 'Sem áreas para apagar',
      },
    },
    handlers: {
      edit: {
        tooltip: {
          text: 'Arraste as arestas ou marcadores para editar uma área.',
          subtext: 'Clique em cancelar para desfazer as mudanças.',
        },
      },
      remove: {
        tooltip: {
          text: 'Clique em uma área para remover.',
        },
      },
    },
  },
};

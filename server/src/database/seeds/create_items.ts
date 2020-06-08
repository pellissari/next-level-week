import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { titulo: 'Lâmpadas', image: 'lampadas.svg' },
        { titulo: 'Pilhas e Baterias', image: 'baterias.svg' },
        { titulo: 'Eletrônicos', image: 'eletronicos.svg' },
        { titulo: 'Óleo de cozinha', image: 'oleo.svg' },
        { titulo: 'Resíduos Orgânicos', image: 'organicos.svg' },
        { titulo: 'Papéis/Papelão', image: 'papeis-papelao.svg' },

    ]);

}
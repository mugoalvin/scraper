import { EntitySchema } from 'typeorm'

export const Sugar = new EntitySchema({
	name: "Sugar",
	tableName: 'sugar',
	columns: {
		id: {
			type: 'int',
			primary: true,
			generated: true
		},
		image: {
            type: 'text'
        },
        productName: {
            type: 'text'
        },
        size: {
            type: 'text',
            nullable: true
        },
        price: {
            type: 'int',
            nullable: true
        },
        originalPrice: {
            type: 'int',
            nullable: true
        },
        discount: {
            type: 'int',
            nullable: true
        },
        webLink: {
            type: 'text',
            nullable: true
        },
        country: {
            type: 'text'
        },
        timestamp: {
            type: 'timestamp'
        }
	}
})
import { SelectItem } from "src/app/inputs/select-input/select-input.component";

export const MATERIAL_PRICE_CALCULATION: any = {
    g: {
        label: '€/Gramo',
        plural: 'Gramos',
        singular: 'Gramo',
    },
    l: {
        label: '€/Litro',
        plural: 'Litros',
        singular: 'Litro',
    },
    u: {
        label: '€/Unidad',
        plural: 'Unidades',
        singular: 'Unidad',
    },
    m: {
        label: '€/Metro',
        plural: 'Metros',
        singular: 'Metro',
    },
    m2: {
        label: '€/Metro cuadrado',
        plural: 'Metros cuadrados',
        singular: 'Metro cuadrado',
    },
};

export const PURCHASE_PRICE_CALCULATION: any = {
    g: {
        label: 'Gramos',
        value: 'g',
        material: '€/Gramo',
        materialValue: 'g',
    },
    'g/u': {
        label: 'Gramos/Unidad',
        value: 'g/u',
        material: '€/Gramo',
        materialValue: 'g',
    },
    l: {
        label: 'Litros',
        value: 'l',
        material: '€/Litro',
        materialValue: 'l',
    },
    'l/u': {
        label: 'Litros/Unidad',
        value: 'l/u',
        material: '€/Litro',
        materialValue: 'l',
    },
    u: {
        label: 'Unidades',
        value: 'u',
        material: '€/Unidad',
        materialValue: 'u',
    },
    m: {
        label: 'Metros',
        value: 'm',
        material: '€/Metro',
        materialValue: 'm',
    },
    'u/m': {
        label: 'Metros/Unidad',
        value: 'u/m',
        material: '€/Metro',
        materialValue: 'm',
    },
    m2: {
        label: 'Metro cuadrado',
        value: 'm2',
        material: '€/Metro cuadrado',
        materialValue: 'm2',
    },
    'u/m2': {
        label: 'Metros cuadrados/Unidad',
        value: 'u/m2',
        material: '€/Metro cuadrado',
        materialValue: 'm2',
    },
}

export const SCALES: any = {
    g: {
        mg: {
            label: 'Miligramos',
            multiplier: 0.001,
        },
        cg: {
            label: 'Centigramos',
            multiplier: 0.01,
        },
        dg: {
            label: 'Decigramos',
            multiplier: 0.1,
        },
        g: {
            label: 'Gramos',
            multiplier: 1,
        },
        dag: {
            label: 'Decagramos',
            multiplier: 10,
        },
        hg: {
            label: 'Hectogramos',
            multiplier: 100,
        },
        kg: {
            label: 'Kilogramos',
            multiplier: 1000,
        },
    },
    l: {
        ml: {
            label: 'Mililitros',
            multiplier: 0.001,
        },
        cl: {
            label: 'Centilitros',
            multiplier: 0.01,
        },
        dl: {
            label: 'Decilitros',
            multiplier: 0.1,
        },
        l: {
            label: 'Litros',
            multiplier: 1,
        },
    },
    m: {
        mm: {
            label: 'Milimetros',
            multiplier: 0.001,
        },
        cm: {
            label: 'Centimetros',
            multiplier: 0.01,
        },
        dm: {
            label: 'Decimetros',
            multiplier: 0.1,
        },
        m: {
            label: 'Metros',
            multiplier: 1,
        },
        dam: {
            label: 'Decametros',
            multiplier: 10,
        },
        hm: {
            label: 'Hectometros',
            multiplier: 100,
        },
        km: {
            label: 'Kilometros',
            multiplier: 1000,
        },
    },
    m2: {
        mm2: {
            label: 'Milimetros Cuadrados',
            multiplier: 0.000001,
        },
        cm2: {
            label: 'Centimetros Cuadrados',
            multiplier: 0.0001,
        },
        dm2: {
            label: 'Decimetros Cuadrados',
            multiplier: 0.01,
        },
        m2: {
            label: 'Metros Cuadrados',
            multiplier: 1,
        },
    },
};

export const getPurchasePriceCalculation = (): SelectItem[] => {
    return Object.keys(PURCHASE_PRICE_CALCULATION).map(option => ({
        label: PURCHASE_PRICE_CALCULATION[option].label,
        value: PURCHASE_PRICE_CALCULATION[option].value,
    }));
}

export const getMaterialPriceCalculation = (): SelectItem[] => {
    return Object.keys(MATERIAL_PRICE_CALCULATION).map(option => ({
        label: MATERIAL_PRICE_CALCULATION[option].label,
        value: option,
    }));
}
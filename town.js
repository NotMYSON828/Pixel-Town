// Building class
class Building {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.level = 1;
        this.data = buildingTypes[type];
    }

    draw(ctx) {
        // Draw building background
        ctx.fillStyle = this.data.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // Draw emoji/symbol
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText(this.data.emoji, this.x + this.width / 2, this.y + this.height / 2);

        // Draw level indicator
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + this.width - 15, this.y + this.height - 15, 14, 14);
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.level, this.x + this.width - 8, this.y + this.height - 8);
    }

    upgrade() {
        this.level++;
        this.data = buildingTypes[this.type];
    }

    getProduction() {
        const base = this.data.production;
        return {
            gold: (base.gold || 0) * this.level,
            food: (base.food || 0) * this.level,
            population: (base.population || 0) * this.level,
            happiness: (base.happiness || 0) * this.level
        };
    }
}

// Building types definition
const buildingTypes = {
    // Original buildings
    house: {
        name: 'House',
        emoji: '🏠',
        color: '#c35a3a',
        cost: 30,
        production: { population: 2, gold: 1, happiness: 0.5 }
    },
    farm: {
        name: 'Farm',
        emoji: '🌾',
        color: '#90ee90',
        cost: 40,
        production: { food: 5, population: 1, happiness: 0.3 }
    },
    market: {
        name: 'Market',
        emoji: '🏪',
        color: '#daa520',
        cost: 60,
        production: { gold: 8, food: 2, happiness: 1 }
    },
    mine: {
        name: 'Mine',
        emoji: '⛏️',
        color: '#696969',
        cost: 80,
        production: { gold: 15, happiness: -0.5 }
    },
    barracks: {
        name: 'Barracks',
        emoji: '🏰',
        color: '#8b4513',
        cost: 100,
        production: { population: 3, gold: 2, happiness: 0.2 }
    },
    
    // New happiness-focused buildings
    tavern: {
        name: 'Tavern',
        emoji: '🍺',
        color: '#8b6914',
        cost: 50,
        production: { gold: 3, happiness: 3 }
    },
    temple: {
        name: 'Temple',
        emoji: '⛪',
        color: '#deb887',
        cost: 120,
        production: { happiness: 4, population: 1 }
    },
    park: {
        name: 'Park',
        emoji: '🌳',
        color: '#228b22',
        cost: 45,
        production: { happiness: 2.5, population: 0.5 }
    },
    garden: {
        name: 'Garden',
        emoji: '🌻',
        color: '#ffb6c1',
        cost: 35,
        production: { food: 2, happiness: 2, population: 0.5 }
    },
    school: {
        name: 'School',
        emoji: '🎓',
        color: '#4169e1',
        cost: 90,
        production: { population: 2, gold: 1, happiness: 1.5 }
    },
    library: {
        name: 'Library',
        emoji: '📚',
        color: '#8b4513',
        cost: 100,
        production: { happiness: 2, population: 0.5, gold: 1 }
    },
    blacksmith: {
        name: 'Blacksmith',
        emoji: '🔨',
        color: '#a9a9a9',
        cost: 95,
        production: { gold: 12, population: 1, happiness: 0.5 }
    },
    bakery: {
        name: 'Bakery',
        emoji: '🍞',
        color: '#d2691e',
        cost: 55,
        production: { food: 4, gold: 2, happiness: 1.5 }
    },
    courthouse: {
        name: 'Courthouse',
        emoji: '⚖️',
        color: '#696969',
        cost: 110,
        production: { happiness: 1.5, population: 0.5, gold: 1 }
    },
    theater: {
        name: 'Theater',
        emoji: '🎭',
        color: '#8b008b',
        cost: 85,
        production: { happiness: 3.5, gold: 2, population: 0.5 }
    },
    fountain: {
        name: 'Fountain',
        emoji: '⛲',
        color: '#87ceeb',
        cost: 40,
        production: { happiness: 1.5, population: 0.3 }
    },
    
    // Roads
    road: {
        name: 'Road',
        emoji: '🛣️',
        color: '#666666',
        cost: 20,
        production: { happiness: 0.5 }
    }
};

// Town class - Manages all buildings and town state
class Town {
    constructor() {
        this.buildings = [];
    }

    addBuilding(type, x, y) {
        // Check if space is empty
        if (this.isBuildingAt(x, y)) {
            alert('Space already occupied!');
            return false;
        }

        const building = new Building(type, x, y);
        this.buildings.push(building);
        return true;
    }

    isBuildingAt(x, y) {
        return this.buildings.some(building => 
            building.x === x && building.y === y
        );
    }

    getBuildingAt(x, y) {
        return this.buildings.find(building => 
            building.x === x && building.y === y
        );
    }

    getBuildingData(type) {
        return buildingTypes[type];
    }

    generateResources() {
        let totalResources = { gold: 0, food: 0, population: 0, happiness: 0 };

        this.buildings.forEach(building => {
            const production = building.getProduction();
            totalResources.gold += production.gold;
            totalResources.food += production.food;
            totalResources.population += production.population;
            totalResources.happiness += production.happiness;
        });

        // Random events (small chance)
        if (Math.random() < 0.05) {
            const bonus = Math.floor(Math.random() * 20);
            totalResources.gold += bonus;
        }

        return totalResources;
    }

    draw(ctx) {
        this.buildings.forEach(building => building.draw(ctx));
    }

    getStats() {
        const stats = {
            totalBuildings: this.buildings.length,
            buildingTypes: {},
            totalProduction: { gold: 0, food: 0, population: 0, happiness: 0 }
        };

        this.buildings.forEach(building => {
            stats.buildingTypes[building.type] = (stats.buildingTypes[building.type] || 0) + 1;
            
            const production = building.getProduction();
            stats.totalProduction.gold += production.gold;
            stats.totalProduction.food += production.food;
            stats.totalProduction.population += production.population;
            stats.totalProduction.happiness += production.happiness;
        });

        return stats;
    }
}

// Game class - Main game engine
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.town = new Town();
        this.selectedBuilding = null;
        this.isRunning = true;
        
        // Game state
        this.day = 1;
        this.gold = 100;
        this.population = 10;
        this.food = 50;
        this.happiness = 50;
        
        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        // Canvas click for building placement
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Building buttons
        document.querySelectorAll('.building-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedBuilding = e.target.closest('.building-btn').dataset.building;
                this.updateBuildingSelection();
            });
        });

        // Action buttons
        document.getElementById('nextDayBtn').addEventListener('click', () => this.nextDay());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }

    handleCanvasClick(e) {
        if (!this.selectedBuilding) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / 32) * 32;
        const y = Math.floor((e.clientY - rect.top) / 32) * 32;

        const buildingData = this.town.getBuildingData(this.selectedBuilding);
        
        if (this.gold >= buildingData.cost) {
            this.town.addBuilding(this.selectedBuilding, x, y);
            this.gold -= buildingData.cost;
            this.updateUI();
        } else {
            alert('Not enough gold! Need ' + buildingData.cost + ', have ' + Math.floor(this.gold));
        }
    }

    updateBuildingSelection() {
        document.querySelectorAll('.building-btn').forEach(btn => {
            btn.style.backgroundColor = '';
        });
        
        if (this.selectedBuilding) {
            const btn = document.querySelector(`[data-building="${this.selectedBuilding}"]`);
            if (btn) btn.style.backgroundColor = '#4ecca3';
        }
    }

    nextDay() {
        this.day++;
        
        // Generate resources based on buildings
        const resources = this.town.generateResources();
        this.gold += resources.gold;
        this.food += resources.food;
        this.population += resources.population;
        this.happiness += resources.happiness;
        
        // Clamp happiness between 0 and 100
        this.happiness = Math.max(0, Math.min(100, this.happiness));
        
        // Consume food
        const foodConsumption = Math.floor(this.population * 0.5);
        this.food -= foodConsumption;
        
        if (this.food < 0) {
            this.population = Math.max(1, Math.floor(this.population * 0.8));
            this.happiness -= 10;
            this.food = 0;
        }
        
        // Low food affects happiness
        if (this.food < 20) {
            this.happiness -= 5;
        }
        
        // Clamp happiness again
        this.happiness = Math.max(0, Math.min(100, this.happiness));
        
        this.updateUI();
    }

    resetGame() {
        if (confirm('Are you sure? This will reset everything.')) {
            this.day = 1;
            this.gold = 100;
            this.population = 10;
            this.food = 50;
            this.happiness = 50;
            this.town = new Town();
            this.selectedBuilding = null;
            this.updateUI();
            this.updateBuildingSelection();
        }
    }

    updateUI() {
        document.getElementById('goldCount').textContent = Math.floor(this.gold);
        document.getElementById('populationCount').textContent = Math.floor(this.population);
        document.getElementById('foodCount').textContent = Math.floor(this.food);
        document.getElementById('dayCount').textContent = this.day;
        document.getElementById('happinessCount').textContent = Math.floor(this.happiness);
        
        // Update happiness bar color
        const happinessBar = document.getElementById('happinessBar');
        if (happinessBar) {
            happinessBar.style.width = this.happiness + '%';
            
            // Change color based on happiness level
            if (this.happiness < 25) {
                happinessBar.style.backgroundColor = '#ff6b6b'; // Red
            } else if (this.happiness < 50) {
                happinessBar.style.backgroundColor = '#ffa500'; // Orange
            } else if (this.happiness < 75) {
                happinessBar.style.backgroundColor = '#ffff00'; // Yellow
            } else {
                happinessBar.style.backgroundColor = '#4ecca3'; // Green
            }
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.drawGrid();

        // Draw buildings
        this.town.draw(this.ctx);

        // Draw selection indicator
        if (this.selectedBuilding) {
            this.drawCursor();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.canvas.width; x += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.canvas.height; y += 32) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawCursor() {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event?.clientX - rect.left || 0) / 32) * 32;
        const y = Math.floor((event?.clientY - rect.top || 0) / 32) * 32;

        if (x >= 0 && x < this.canvas.width && y >= 0 && y < this.canvas.height) {
            this.ctx.fillStyle = 'rgba(78, 204, 163, 0.3)';
            this.ctx.fillRect(x, y, 32, 32);
            this.ctx.strokeStyle = '#4ecca3';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, 32, 32);
        }
    }

    gameLoop() {
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});

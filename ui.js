// UI Helper functions
const UI = {
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num).toString();
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    getTownInfo(game) {
        const stats = game.town.getStats();
        return {
            day: game.day,
            gold: Math.floor(game.gold),
            population: Math.floor(game.population),
            food: Math.floor(game.food),
            buildings: stats.totalBuildings,
            production: stats.totalProduction
        };
    }
};

// Add styling for notifications (dynamically)
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            font-weight: bold;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        }

        .notification-info {
            background: #4ecca3;
            color: #fff;
            border: 2px solid #2a9d6f;
        }

        .notification-warning {
            background: #e94560;
            color: #fff;
            border: 2px solid #c71e3f;
        }

        .notification-success {
            background: #4ecca3;
            color: #fff;
            border: 2px solid #2a9d6f;
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}
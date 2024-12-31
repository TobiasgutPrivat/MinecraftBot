const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'Bob'
});

function lookAtNearbyPlayer() {
    const playerEntity = bot.nearestEntity(
        (entity) => entity.type === 'player'
    );

    if (!playerEntity) {
        return;
    }

    bot.lookAt(playerEntity.position.offset(0, playerEntity.height, 0));
}

bot.on('physicTick', () => {
    lookAtNearbyPlayer();
});
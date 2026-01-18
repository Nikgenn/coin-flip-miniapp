// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CoinFlip
 * @dev Простая игра в орлянку для Base Mini App
 * @notice Без реальных ставок - только для развлечения!
 */
contract CoinFlip {
    // ============ Структуры ============
    
    struct PlayerStats {
        uint256 totalFlips;      // Всего бросков
        uint256 totalWins;       // Всего побед
        uint256 currentStreak;   // Текущая серия побед
        uint256 bestStreak;      // Лучшая серия побед
        uint256 lastFlipDay;     // День последнего броска (для лимита 1/день)
    }
    
    // ============ События ============
    
    event CoinFlipped(
        address indexed player,
        bool chosenHeads,        // true = Орёл, false = Решка
        bool result,             // true = Орёл, false = Решка
        bool won,                // Победил ли игрок
        uint256 totalFlips,
        uint256 totalWins,
        uint256 currentStreak
    );
    
    // ============ Состояние ============
    
    mapping(address => PlayerStats) public playerStats;
    
    // Глобальная статистика
    uint256 public totalGlobalFlips;
    uint256 public totalGlobalWins;
    
    // ============ Модификаторы ============
    
    modifier oncePerDay() {
        uint256 today = block.timestamp / 1 days;
        require(
            playerStats[msg.sender].lastFlipDay < today,
            "Already flipped today! Come back tomorrow."
        );
        _;
    }
    
    // ============ Основные функции ============
    
    /**
     * @dev Бросить монету
     * @param chooseHeads true = ставка на Орла, false = ставка на Решку
     */
    function flip(bool chooseHeads) external oncePerDay returns (bool won) {
        // Генерация псевдослучайного результата
        // ВНИМАНИЕ: Это НЕ безопасно для реальных ставок!
        // Для продакшена с реальными деньгами нужен Chainlink VRF
        bool result = _generateRandomResult();
        
        // Определяем победу
        won = (chooseHeads == result);
        
        // Обновляем статистику игрока
        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalFlips++;
        stats.lastFlipDay = block.timestamp / 1 days;
        
        if (won) {
            stats.totalWins++;
            stats.currentStreak++;
            
            if (stats.currentStreak > stats.bestStreak) {
                stats.bestStreak = stats.currentStreak;
            }
            
            totalGlobalWins++;
        } else {
            stats.currentStreak = 0;
        }
        
        totalGlobalFlips++;
        
        // Эмитим событие
        emit CoinFlipped(
            msg.sender,
            chooseHeads,
            result,
            won,
            stats.totalFlips,
            stats.totalWins,
            stats.currentStreak
        );
        
        return won;
    }
    
    /**
     * @dev Проверить, может ли игрок сделать бросок сегодня
     */
    function canFlipToday(address player) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return playerStats[player].lastFlipDay < today;
    }
    
    /**
     * @dev Получить статистику игрока
     */
    function getPlayerStats(address player) external view returns (
        uint256 totalFlips,
        uint256 totalWins,
        uint256 currentStreak,
        uint256 bestStreak,
        bool canFlip
    ) {
        PlayerStats storage stats = playerStats[player];
        uint256 today = block.timestamp / 1 days;
        
        return (
            stats.totalFlips,
            stats.totalWins,
            stats.currentStreak,
            stats.bestStreak,
            stats.lastFlipDay < today
        );
    }
    
    /**
     * @dev Получить процент побед игрока
     */
    function getWinRate(address player) external view returns (uint256) {
        PlayerStats storage stats = playerStats[player];
        if (stats.totalFlips == 0) return 0;
        return (stats.totalWins * 100) / stats.totalFlips;
    }
    
    // ============ Внутренние функции ============
    
    /**
     * @dev Генерация псевдослучайного результата
     * @notice НЕ ИСПОЛЬЗОВАТЬ для реальных ставок!
     */
    function _generateRandomResult() private view returns (bool) {
        // Комбинируем несколько источников энтропии
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    totalGlobalFlips,
                    blockhash(block.number - 1)
                )
            )
        );
        
        return randomNumber % 2 == 0;
    }
}

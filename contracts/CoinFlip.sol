// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title CoinFlip
 * @dev Простая игра в орлянку для Base Mini App
 * @notice Без реальных ставок - только для развлечения!
 */
contract CoinFlip {
    // ============ Константы ============
    
    uint256 public constant DAILY_FREE_FLIPS = 3; // 3 бесплатных флипа в день
    
    // ============ Структуры ============
    
    struct PlayerStats {
        uint256 totalFlips;      // Всего бросков
        uint256 totalWins;       // Всего побед
        uint256 currentStreak;   // Текущая серия побед
        uint256 bestStreak;      // Лучшая серия побед
        uint256 lastFlipDay;     // День последнего броска
        uint256 flipsToday;      // Количество флипов сегодня
    }
    
    // ============ События ============
    
    event CoinFlipped(
        address indexed player,
        bool chosenHeads,        // true = Орёл, false = Решка
        bool result,             // true = Орёл, false = Решка
        bool won,                // Победил ли игрок
        uint256 totalFlips,
        uint256 totalWins,
        uint256 currentStreak,
        uint256 flipsRemaining   // Оставшиеся флипы сегодня
    );
    
    // ============ Состояние ============
    
    mapping(address => PlayerStats) public playerStats;
    
    // Глобальная статистика
    uint256 public totalGlobalFlips;
    uint256 public totalGlobalWins;
    
    // Список всех игроков для лидерборда
    address[] public allPlayers;
    mapping(address => bool) public isPlayer;
    
    // ============ Модификаторы ============
    
    modifier hasFlipsRemaining() {
        uint256 today = block.timestamp / 1 days;
        PlayerStats storage stats = playerStats[msg.sender];
        
        // Если новый день - сбрасываем счётчик
        if (stats.lastFlipDay < today) {
            stats.flipsToday = 0;
            stats.lastFlipDay = today;
        }
        
        require(
            stats.flipsToday < DAILY_FREE_FLIPS,
            "No flips remaining today! Come back tomorrow."
        );
        _;
    }
    
    // ============ Основные функции ============
    
    /**
     * @dev Бросить монету
     * @param chooseHeads true = ставка на Орла, false = ставка на Решку
     */
    function flip(bool chooseHeads) external hasFlipsRemaining returns (bool won) {
        // Генерация псевдослучайного результата
        // ВНИМАНИЕ: Это НЕ безопасно для реальных ставок!
        // Для продакшена с реальными деньгами нужен Chainlink VRF
        bool result = _generateRandomResult();
        
        // Определяем победу
        won = (chooseHeads == result);
        
        // Регистрируем нового игрока
        if (!isPlayer[msg.sender]) {
            isPlayer[msg.sender] = true;
            allPlayers.push(msg.sender);
        }
        
        // Обновляем статистику игрока
        PlayerStats storage stats = playerStats[msg.sender];
        stats.totalFlips++;
        stats.flipsToday++;
        
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
        
        // Вычисляем оставшиеся флипы
        uint256 flipsRemaining = DAILY_FREE_FLIPS - stats.flipsToday;
        
        // Эмитим событие
        emit CoinFlipped(
            msg.sender,
            chooseHeads,
            result,
            won,
            stats.totalFlips,
            stats.totalWins,
            stats.currentStreak,
            flipsRemaining
        );
        
        return won;
    }
    
    /**
     * @dev Получить количество оставшихся флипов сегодня
     */
    function getFlipsRemaining(address player) external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        PlayerStats storage stats = playerStats[player];
        
        // Если новый день - все флипы доступны
        if (stats.lastFlipDay < today) {
            return DAILY_FREE_FLIPS;
        }
        
        // Иначе возвращаем остаток
        if (stats.flipsToday >= DAILY_FREE_FLIPS) {
            return 0;
        }
        return DAILY_FREE_FLIPS - stats.flipsToday;
    }
    
    /**
     * @dev Проверить, может ли игрок сделать бросок сегодня (для обратной совместимости)
     */
    function canFlipToday(address player) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        PlayerStats storage stats = playerStats[player];
        
        if (stats.lastFlipDay < today) {
            return true;
        }
        return stats.flipsToday < DAILY_FREE_FLIPS;
    }
    
    /**
     * @dev Получить статистику игрока
     */
    function getPlayerStats(address player) external view returns (
        uint256 totalFlips,
        uint256 totalWins,
        uint256 currentStreak,
        uint256 bestStreak,
        bool canFlip,
        uint256 flipsRemaining
    ) {
        PlayerStats storage stats = playerStats[player];
        uint256 today = block.timestamp / 1 days;
        
        uint256 remaining;
        bool canFlipNow;
        
        if (stats.lastFlipDay < today) {
            remaining = DAILY_FREE_FLIPS;
            canFlipNow = true;
        } else {
            remaining = stats.flipsToday >= DAILY_FREE_FLIPS ? 0 : DAILY_FREE_FLIPS - stats.flipsToday;
            canFlipNow = remaining > 0;
        }
        
        return (
            stats.totalFlips,
            stats.totalWins,
            stats.currentStreak,
            stats.bestStreak,
            canFlipNow,
            remaining
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
    
    /**
     * @dev Получить общее количество игроков
     */
    function getTotalPlayers() external view returns (uint256) {
        return allPlayers.length;
    }
    
    /**
     * @dev Получить данные для лидерборда (топ игроков по победам)
     * @param limit Максимальное количество игроков
     */
    function getLeaderboard(uint256 limit) external view returns (
        address[] memory addresses,
        uint256[] memory wins,
        uint256[] memory flips,
        uint256[] memory streaks
    ) {
        uint256 count = allPlayers.length;
        if (count == 0) {
            return (new address[](0), new uint256[](0), new uint256[](0), new uint256[](0));
        }
        
        uint256 resultSize = count < limit ? count : limit;
        
        // Создаём временные массивы для сортировки
        address[] memory tempAddresses = new address[](count);
        uint256[] memory tempWins = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            tempAddresses[i] = allPlayers[i];
            tempWins[i] = playerStats[allPlayers[i]].totalWins;
        }
        
        // Простая сортировка (bubble sort) - достаточно для небольшого количества
        for (uint256 i = 0; i < count - 1; i++) {
            for (uint256 j = 0; j < count - i - 1; j++) {
                if (tempWins[j] < tempWins[j + 1]) {
                    // Swap
                    (tempWins[j], tempWins[j + 1]) = (tempWins[j + 1], tempWins[j]);
                    (tempAddresses[j], tempAddresses[j + 1]) = (tempAddresses[j + 1], tempAddresses[j]);
                }
            }
        }
        
        // Создаём результирующие массивы
        addresses = new address[](resultSize);
        wins = new uint256[](resultSize);
        flips = new uint256[](resultSize);
        streaks = new uint256[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            addresses[i] = tempAddresses[i];
            PlayerStats storage stats = playerStats[tempAddresses[i]];
            wins[i] = stats.totalWins;
            flips[i] = stats.totalFlips;
            streaks[i] = stats.bestStreak;
        }
        
        return (addresses, wins, flips, streaks);
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

import initSqlJs from "sql.js";

// 1. Глобальная переменная для хранения базы данных
let db;

// 2. Инициализация базы данных
export const initDatabase = async () => {
    const SQL = await initSqlJs();
    db = new SQL.Database();
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT,
            total_price REAL
        );
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT,
            product_id INTEGER,
            name TEXT,
            quantity INTEGER,
            price REAL,
            unit TEXT
        );
    `);
    console.log("База данных инициализирована");
};

// 3. Функция для сохранения заказа в SQLite
export const saveOrderToDatabase = async (cartItemsWithDetails, totalCost) => {
    if (!db) {
        console.error("База данных не инициализирована");
        return;
    }

    try {
        // Начинаем транзакцию
        db.run("BEGIN TRANSACTION");

        // Добавляем заказ в таблицу orders
        const orderNumber = null; // Для ожидания номера заказа от сервера
        const insertOrderQuery = `
            INSERT INTO orders (order_number, total_price) 
            VALUES ($orderNumber, $totalPrice)
        `;
        db.run(insertOrderQuery, { $orderNumber: orderNumber, $totalPrice: totalCost });

        // Получаем ID последнего заказа
        const orderIdQuery = "SELECT last_insert_rowid() AS id";
        const result = db.exec(orderIdQuery);
        const orderId = result[0]?.values[0]?.[0]; // ID созданного заказа

        if (!orderId) {
            throw new Error("Не удалось получить ID вставленного заказа");
        }

        // Добавляем позиции заказа в таблицу order_items
        for (const cartItem of cartItemsWithDetails) {
            const insertItemQuery = `
                INSERT INTO order_items (order_id, product_id, name, quantity, price, unit)
                VALUES ($orderId, $productId, $name, $quantity, $price, $unit)
            `;
            db.run(insertItemQuery, {
                $orderId: orderId,
                $productId: cartItem.id,
                $name: cartItem.name,
                $quantity: cartItem.quantity,
                $price: cartItem.price,
                $unit: cartItem.unit,
            });
        }

        // Завершаем транзакцию
        db.run("COMMIT");
        console.log("Заказ успешно сохранен в SQLite");
    } catch (error) {
        // В случае ошибки откатываем изменения
        db.run("ROLLBACK");
        console.error("Ошибка сохранения заказа в SQLite:", error);
        throw error;
    }
};

export default initDatabase;



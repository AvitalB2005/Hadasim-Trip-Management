use hadasim_trip;

-- טבלת כיתות
CREATE TABLE Classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(20) NOT NULL UNIQUE
);

-- טבלת משתמשים (כולל סיסמה ו-ENUM)
CREATE TABLE Users (
    user_id VARCHAR(9) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- לשמירת סיסמה מוצפנת
    -- שימוש ב-ENUM: מקבל רק את שני הערכים האלו
    role ENUM('teacher', 'student') NOT NULL DEFAULT 'student',
    class_id INT,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE SET NULL
);

-- טבלת מיקומים
CREATE TABLE Locations (
    user_id VARCHAR(9) PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    device_time DATETIME, 
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
import React from "react";

function Dashboard() {
  return (
    <div className="home-container" style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sonli usullar fanidan mustaqil ish</h1>
        <p style={styles.description}>
          Ushbu dastur orqali siz interpolatsiya bo‘yicha asosiy usullarni
          hisoblab chiqishingiz mumkin:
        </p>
        <ul style={styles.list}>
          <li>Nyutonning 1-ko‘rinishdagi interpolatsiyasi</li>
          <li>Nyutonning 2-ko‘rinishdagi interpolatsiyasi</li>
          <li>Lagranj interpolatsiyasi</li>
        </ul>
        <p style={styles.footer}>
          Iltimos, menyudan usulni tanlang va kerakli maʼlumotlarni kiriting.
        </p>
      </div>
    </div>
  );
}
const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f4f6f8",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px 40px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e88e5",
    marginBottom: "20px",
  },
  description: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "16px",
  },
  list: {
    paddingLeft: "20px",
    fontSize: "16px",
    color: "#555",
  },
  footer: {
    marginTop: "20px",
    fontSize: "16px",
    color: "#777",
    fontStyle: "italic",
  },
};

export default Dashboard;

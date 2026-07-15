function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <section
        style={{
          textAlign: "center",
          background: "white",
          padding: "48px",
          borderRadius: "24px",
          boxShadow: "var(--shadow-md)",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        <h1>The Seven Rand Marketplace</h1>

        <p
          style={{
            marginTop: "20px",
            color: "var(--color-text-light)",
          }}
        >
          South Africa's Safest and Most Trusted Marketplace
        </p>

        <h3
          style={{
            marginTop: "32px",
            color: "var(--color-primary)",
          }}
        >
          Smaller Fee. Bigger Deals.
        </h3>

        <p
          style={{
            marginTop: "24px",
          }}
        >
          Every Deal Starts With Trust.
        </p>
      </section>
    </main>
  );
}

export default App;
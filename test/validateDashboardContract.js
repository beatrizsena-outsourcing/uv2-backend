async function validate() {
  const res = await fetch("http://localhost:3000/api/dashboard/kpis");
  const data = await res.json();

  console.log("=== VALIDANDO CONTRATO V1 ===");

  console.log("success:", typeof data.success);
  console.log("version:", data.version);
  console.log("ranking length:", data.ranking.length);
  console.log("first item:", data.ranking[0]);
  console.log("score exists:", typeof data.ranking[0].score);
}

validate();
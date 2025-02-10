document.addEventListener("DOMContentLoaded", function() {
    const transaksiTable = document.querySelector("tbody");
    const searchInput = document.getElementById("search");
    const filterSelect = document.getElementById("filter");

    // Data dummy transaksi
    let transaksiData = [
        { kode: "TRT-1001", jenis: "Tarik Tunai", keterangan: "Di bawah 1 juta", jumlah: "Rp1.000.000", biaya: "Rp5.000", profit: "Rp6.500" },
        { kode: "TFB-1002", jenis: "Transfer", keterangan: "Bank Lain", jumlah: "Rp2.000.000", biaya: "Rp10.000", profit: "Rp15.000" },
        { kode: "BPJ-101", jenis: "Pembayaran", keterangan: "BPJS Kesehatan", jumlah: "Rp150.000", biaya: "Rp2.000", profit: "Rp3.000" },
    ];

    function tampilkanTransaksi(data) {
        transaksiTable.innerHTML = "";
        data.forEach(trx => {
            let row = `
                <tr>
                    <td>${trx.kode}</td>
                    <td>${trx.jenis}</td>
                    <td>${trx.keterangan}</td>
                    <td>${trx.jumlah}</td>
                    <td>${trx.biaya}</td>
                    <td>${trx.profit}</td>
                </tr>
            `;
            transaksiTable.innerHTML += row;
        });
    }

    searchInput.addEventListener("input", function() {
        let keyword = searchInput.value.toLowerCase();
        let hasilFilter = transaksiData.filter(trx => 
            trx.kode.toLowerCase().includes(keyword) || 
            trx.jenis.toLowerCase().includes(keyword) ||
            trx.keterangan.toLowerCase().includes(keyword)
        );
        tampilkanTransaksi(hasilFilter);
    });

    filterSelect.addEventListener("change", function() {
        let kategori = filterSelect.value;
        if (kategori === "all") {
            tampilkanTransaksi(transaksiData);
        } else {
            let hasilFilter = transaksiData.filter(trx => trx.jenis.toLowerCase().includes(kategori));
            tampilkanTransaksi(hasilFilter);
        }
    });

    tampilkanTransaksi(transaksiData);

    // Fullscreen & Normal Screen
    document.getElementById("fullscreen").addEventListener("click", function() {
        document.documentElement.requestFullscreen();
    });

    document.getElementById("normalscreen").addEventListener("click", function() {
        document.exitFullscreen();
    });

    // Grafik Transaksi
    const ctx = document.getElementById("grafikTransaksi").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: transaksiData.map(trx => trx.kode),
            datasets: [{
                label: "Profit",
                data: transaksiData.map(trx => parseInt(trx.profit.replace("Rp", "").replace(",", ""))),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Ekspor ke PDF
    document.getElementById("exportPDF").addEventListener("click", function() {
        let doc = new jsPDF();
        doc.text("Laporan Keuangan", 10, 10);
        doc.autoTable({ html: "table" });
        doc.save("Laporan_Keuangan.pdf");
    });

    // Ekspor ke Excel
    document.getElementById("exportExcel").addEventListener("click", function() {
        let table = document.querySelector("table");
        let wb = XLSX.utils.table_to_book(table, {sheet: "Laporan"});
        XLSX.writeFile(wb, "Laporan_Keuangan.xlsx");
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const totalKeuntunganEl = document.getElementById("totalKeuntungan");
    const totalPengeluaranEl = document.getElementById("totalPengeluaran");

    // Data transaksi (dummy)
    let transaksiData = [
        { kode: "TRT-1001", jenis: "Tarik Tunai", keterangan: "Di bawah 1 juta", jumlah: "Rp1.000.000", biaya: "Rp5.000", profit: "Rp6.500" },
        { kode: "TFB-1002", jenis: "Transfer", keterangan: "Bank Lain", jumlah: "Rp2.000.000", biaya: "Rp10.000", profit: "Rp15.000" },
        { kode: "BPJ-101", jenis: "Pembayaran", keterangan: "BPJS Kesehatan", jumlah: "Rp150.000", biaya: "Rp2.000", profit: "Rp3.000" },
    ];

    // Hitung total keuntungan dan pengeluaran
    let totalKeuntungan = transaksiData.reduce((sum, trx) => sum + parseInt(trx.profit.replace("Rp", "").replace(",", "")), 0);
    let totalPengeluaran = transaksiData.reduce((sum, trx) => sum + parseInt(trx.biaya.replace("Rp", "").replace(",", "")), 0);

    // Tampilkan data ke halaman
    totalKeuntunganEl.textContent = `Rp ${totalKeuntungan.toLocaleString("id-ID")},00`;
    totalPengeluaranEl.textContent = `Rp ${totalPengeluaran.toLocaleString("id-ID")},00`;

    // Buat grafik perbandingan keuntungan & pengeluaran
    const ctxKeuangan = document.getElementById("grafikKeuangan").getContext("2d");
    new Chart(ctxKeuangan, {
        type: "pie",
        data: {
            labels: ["Keuntungan", "Pengeluaran"],
            datasets: [{
                data: [totalKeuntungan, totalPengeluaran],
                backgroundColor: ["#00FF00", "#FF0000"],
                borderColor: ["#008000", "#8B0000"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                }
            }
        }
    });
});
document.addEventListener("DOMContentLoaded", function() {
    const transaksiBody = document.getElementById("transaksiBody");
    const transaksiForm = document.getElementById("transaksiForm");
    const formTransaksi = document.getElementById("formTransaksi");
    const jenisTransaksiInput = document.getElementById("jenisTransaksi");

    let transaksiData = [];

    document.querySelectorAll(".menu-btn").forEach(button => {
        button.addEventListener("click", function() {
            formTransaksi.classList.remove("hidden");
            jenisTransaksiInput.value = this.dataset.type;
        });
    });

    transaksiForm.addEventListener("submit", function(event) {
        event.preventDefault();

        let jenis = jenisTransaksiInput.value;
        let keterangan = document.getElementById("keterangan").value;
        let jumlah = parseInt(document.getElementById("jumlah").value);
        let biaya = parseInt(document.getElementById("biayaJasa").value);

        transaksiData.push({ jenis, keterangan, jumlah, biaya });
        renderTransaksi();
        transaksiForm.reset();
        formTransaksi.classList.add("hidden");
    });

    function formatRupiah(angka) {
        return "Rp " + angka.toLocaleString("id-ID") + ",00";
    }

    function renderTransaksi() {
        transaksiBody.innerHTML = "";
        transaksiData.forEach(trx => {
            let row = `<tr>
                <td>${trx.jenis}</td>
                <td>${trx.keterangan}</td>
                <td>${formatRupiah(trx.jumlah)}</td>
                <td>${formatRupiah(trx.biaya)}</td>
            </tr>`;
            transaksiBody.innerHTML += row;
        });
    }
});


// =====================================
// ========== GLOBAL INIT ==============
// =====================================
document.addEventListener("DOMContentLoaded", () => {
    initLogin();
    initModal();
    initDashboard();
    initMenu();
    initStock();
});

// =====================================
// ========== LOGIN ====================
// =====================================
function initLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            return Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Email dan Password wajib diisi!",
                confirmButtonColor: "#f39c12",
            });
        }

        const user = dataPengguna.find(
            (u) => u.email === email && u.password === password
        );

        if (!user) {
            return Swal.fire({
                icon: "error",
                title: "Login Gagal",
                text: "Email atau password salah!",
                confirmButtonColor: "#d33",
            });
        }

        sessionStorage.setItem("loggedUser", JSON.stringify(user));

        Swal.fire({
            icon: "success",
            title: "Login Berhasil!",
            text: `Selamat datang, ${user.nama}`,
            confirmButtonColor: "#0d47a1",
        }).then(() => {
            Swal.fire({
                title: "Memproses...",
                timer: 1200,
                didOpen: () => Swal.showLoading(),
            }).then(() => {
                window.location.href = "dashboard.html";
            });
        });
    });
}

// =====================================
// ========== MODAL ====================
// =====================================
function initModal() {
    const modalForgot = document.getElementById("modalForgot");
    const modalRegister = document.getElementById("modalRegister");
   
    document.getElementById("forgotPassword")?.addEventListener("click", () => {
        modalForgot.style.display = "flex";
    });

    document.getElementById("register")?.addEventListener("click", () => {
        modalRegister.style.display = "flex";
    });

    document.querySelectorAll(".close").forEach((btn) => {
        btn.addEventListener("click", () => {
            modalForgot.style.display = "none";
            modalRegister.style.display = "none";
        });
    });
}

// =====================================
// ========== DASHBOARD ===============
// =====================================
function initDashboard() {
    const greeting = document.getElementById("greeting");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!greeting) return;

    const userData = sessionStorage.getItem("loggedUser");

    if (!userData) {
        alert("Silakan login terlebih dahulu!");
        return (window.location.href = "index.html");
    }

    const user = JSON.parse(userData);

    const hour = new Date().getHours();
    const greetText =
        hour < 12 ? "Selamat Pagi" :
            hour < 17 ? "Selamat Siang" :
                hour < 20 ? "Selamat Sore" :
                    "Selamat Malam";

    greeting.textContent = `${greetText}, ${user.nama} (${user.role})`;

    logoutBtn?.addEventListener("click", () => {
        sessionStorage.removeItem("loggedUser");
        window.location.href = "index.html";
    });
}

// =====================================
// ========== MENU =====================
// =====================================
function initMenu() {
    const menuStok = document.getElementById("menuStok");
    const menuTracking = document.getElementById("menuTracking");
    const menuLaporan = document.getElementById("menuLaporan");
    const menuHistori = document.getElementById("menuHistori");

    const dropdown = document.getElementById("dropdownLaporan");
    const laporanMonitoring = document.getElementById("laporanMonitoring");
    const laporanRekap = document.getElementById("laporanRekap");

    menuStok?.addEventListener("click", () => {
        window.location.href = "stok.html";
    });

    menuTracking?.addEventListener("click", () => {
        window.location.href = "tracking.html";
    });

    menuLaporan?.addEventListener("click", () => {
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    });

    laporanMonitoring?.addEventListener("click", (e) => {
        e.stopPropagation();
        showInfo("Monitoring Progress DO Bahan Ajar Belum Tersedia!");
    });

    laporanRekap?.addEventListener("click", (e) => {
        e.stopPropagation();
        showInfo("Rekap Bahan Ajar Belum Tersedia!");
    });

    menuHistori?.addEventListener("click", () => {
        showInfo("Histori Transaksi Bahan Ajar Belum Tersedia!");
    });
}

// =====================================
// ========== TRACKING =================
// =====================================
function getProgress(status) {
    switch (status.toLowerCase()) {
        case "diproses": return 25;
        case "dikirim": return 60;
        case "dalam perjalanan": return 80;
        case "selesai": return 100;
        default: return 10;
    }
}

const btnCari = document.getElementById("btnCari");
if (btnCari) {
    btnCari.addEventListener("click", cariDO);
    function cariDO() {
        const input = document.getElementById("inputDO").value.trim();
        const container = document.getElementById("trackingResult");

        container.innerHTML = "";

        if (!input) {
            return Swal.fire({
                icon: "warning",
                text: "Silakan masukkan nomor DO terlebih dahulu!",
            });
        }

        const data = dataTracking?.[input];

        if (!data) {
            return Swal.fire({
                icon: "error",
                title: "Maaf...",
                text: `Nomor DO ${input} tidak ditemukan!`,
            });
        }

        const progress = getProgress(data.status);

        container.innerHTML = `
    <div class="result-card">
      <h3>Detail Pengiriman</h3>
      <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
      <p><strong>Nama:</strong> ${data.nama}</p>
      <p><strong>Status:</strong> 
        <span class="status ${data.statusClass}">
          ${data.status}
        </span>
      </p>

      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="progress-text">Progress: ${progress}%</div>
      </div>

      <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
      <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
      <p><strong>Total:</strong> ${data.total}</p>

      <h4>Riwayat Perjalanan</h4>

      <div class="timeline">
        ${(data.perjalanan || []).map(p => `
          <div class="timeline-item">
            <div>${p.keterangan}</div>
            <div class="timeline-date">${p.waktu}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
    }
}

// =====================================
// ========== STOCK ====================
// =====================================
function initStock() {
    tampilkanStok();

    const btnTambah = document.getElementById("btnTambah");
    const btnBack = document.getElementById("btnBack");
    const closeModalBtn = document.getElementById("closeModal");
    const formTambah = document.getElementById("formTambah");
    const modalForm = document.getElementById("modalForm");
    if (!btnTambah || !btnBack || !closeModalBtn || !formTambah || !modalForm) return;
    document.getElementById("modalForm").style.display = "none";
    btnTambah?.addEventListener("click", openModal);
    closeModalBtn?.addEventListener("click", closeModal);

    btnBack?.addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });

    formTambah?.addEventListener("submit", function (e) {
        e.preventDefault();
        simpanData();
    });
}

function tampilkanStok() {
    const tabelBody = document.getElementById("tabelBody");
    if (!tabelBody) return;

    tabelBody.innerHTML = "";

    dataBahanAjar.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${item.kodeLokasi}</td>
      <td>${item.kodeBarang}</td>
      <td>${item.namaBarang}</td>
      <td>${item.jenisBarang}</td>
      <td>${item.edisi}</td>
      <td>${item.stok}</td>
      <td><img src="${item.cover}" width="50" style="cursor:pointer;border-radius:5px"
    onclick="showImage('${item.cover}')"/></td>
    `;
        tabelBody.appendChild(row);
    });
}

// =====================================
// ========== MODAL FORM ==============
// =====================================
function openModal() {
    document.getElementById("modalForm").style.display = "flex";
}

function closeModal() {
    document.getElementById("modalForm").style.display = "none";
}

function showImage(src) {
    document.getElementById("imgModal").style.display = "flex";
    document.getElementById("imgPreview").src = src;
}

function closeImage() {
    document.getElementById("imgModal").style.display = "none";
}
// =====================================
// ========== SIMPAN DATA =============
// =====================================
function simpanData() {
    const newData = {
        kodeLokasi: document.getElementById("kodeLokasi").value.trim(),
        kodeBarang: document.getElementById("kodeBarang").value.trim(),
        namaBarang: document.getElementById("namaBarang").value.trim(),
        jenisBarang: document.getElementById("jenisBarang").value.trim(),
        edisi: document.getElementById("edisi").value.trim(),
        stok: parseInt(document.getElementById("stok").value),
        cover: "img/default.jpg",
    };

    if (!newData.kodeLokasi || !newData.kodeBarang || !newData.namaBarang || isNaN(newData.stok)) {
        return Swal.fire({
            icon: "warning",
            text: "Lengkapi semua data dengan benar!",
        });
    }

    dataBahanAjar.push(newData);
    tampilkanStok();
    closeModal();

    Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil ditambahkan",
    });

    document.getElementById("formTambah").reset();
}

// =====================================
// ========== HELPER ===================
// =====================================
function showInfo(message) {
    Swal.fire({
        icon: "info",
        text: message,
        confirmButtonColor: "#d33",
        background: "#fff5f5",
    });
}
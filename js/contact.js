// ข้อมูลที่อยู่โหลดจาก data/*.json
let provincesData = [];
let districtsData = [];
let subDistrictsData = [];

// เก็บข้อมูลคำร้องเรียนใน localStorage
let complaintsData = JSON.parse(localStorage.getItem('complaintsData')) || [];

// รหัสผ่าน Admin
const ADMIN_PASSWORD = 'admin1234';

// โหลดข้อมูลทั้งหมดเมื่อหน้าเว็บโหลด
document.addEventListener('DOMContentLoaded', async function() {
    await loadAddressData();
    setupEventListeners();
    selectComplaintType('inquiry');
});

// โหลดข้อมูลจังหวัด อำเภอ ตำบล จากไฟล์ JSON
async function loadAddressData() {
    try {
        const [pRes, dRes, sRes] = await Promise.all([
            fetch('data/provinces.json'),
            fetch('data/districts.json'),
            fetch('data/sub_districts.json')
        ]);
        provincesData = await pRes.json();
        districtsData = await dRes.json();
        subDistrictsData = await sRes.json();
        loadProvinces();
    } catch (e) {
        console.error('โหลดข้อมูลที่อยู่ไม่ได้:', e);
    }
}

// โหลดข้อมูลจังหวัดลงใน dropdown
function loadProvinces() {
    const provinceSelect = document.getElementById('province');
    provincesData.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name_th;
        provinceSelect.appendChild(option);
    });
}

// เมื่อเลือกจังหวัด ให้โหลดอำเภอ
document.getElementById('province')?.addEventListener('change', function() {
    const provinceId = parseInt(this.value);
    const districtSelect = document.getElementById('district');
    const subdistrictSelect = document.getElementById('subdistrict');

    districtSelect.innerHTML = '<option value="">เลือกอำเภอ/เขต</option>';
    subdistrictSelect.innerHTML = '<option value="">เลือกตำบล/แขวง</option>';
    document.getElementById('postalCode').value = '';
    subdistrictSelect.disabled = true;

    if (provinceId) {
        const filtered = districtsData.filter(d => d.province_id === provinceId);
        filtered.forEach(d => {
            const option = document.createElement('option');
            option.value = d.id;
            option.textContent = d.name_th;
            districtSelect.appendChild(option);
        });
        districtSelect.disabled = false;
    } else {
        districtSelect.disabled = true;
    }
});

// เมื่อเลือกอำเภอ ให้โหลดตำบล
document.getElementById('district')?.addEventListener('change', function() {
    const districtId = parseInt(this.value);
    const subdistrictSelect = document.getElementById('subdistrict');

    subdistrictSelect.innerHTML = '<option value="">เลือกตำบล/แขวง</option>';
    document.getElementById('postalCode').value = '';

    if (districtId) {
        const filtered = subDistrictsData.filter(s => s.district_id === districtId);
        filtered.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.dataset.zip = s.zip_code;
            option.textContent = s.name_th;
            subdistrictSelect.appendChild(option);
        });
        subdistrictSelect.disabled = false;
    } else {
        subdistrictSelect.disabled = true;
    }
});

// เมื่อเลือกตำบล ให้แสดงรหัสไปรษณีย์
document.getElementById('subdistrict')?.addEventListener('change', function() {
    const selected = this.options[this.selectedIndex];
    document.getElementById('postalCode').value = selected?.dataset.zip || '';
});

// ตั้งค่า Event Listeners
function setupEventListeners() {
    document.getElementById('complaintForm')?.addEventListener('submit', handleFormSubmit);

    document.getElementById('adminBtn')?.addEventListener('click', function() {
        document.getElementById('adminModal').style.display = 'block';
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// จัดการการส่งฟอร์ม
function handleFormSubmit(e) {
    e.preventDefault();

    const provinceId = parseInt(document.getElementById('province').value);
    const districtId = parseInt(document.getElementById('district').value);
    const subdistrictEl = document.getElementById('subdistrict');
    const subdistrictId = parseInt(subdistrictEl.value);

    const provinceName = provincesData.find(p => p.id === provinceId)?.name_th || '';
    const districtName = districtsData.find(d => d.id === districtId)?.name_th || '';
    const subdistrictName = subDistrictsData.find(s => s.id === subdistrictId)?.name_th || '';

    const genderMap = { male: 'ชาย', female: 'หญิง', lgbtq: 'LGBTQ+' };
    const genderVal = document.getElementById('gender').value;

    const formData = {
        id: 'COMP-' + Date.now(),
        type: document.getElementById('complaintType').value,
        name: document.getElementById('name').value,
        gender: genderMap[genderVal] || genderVal,
        age: document.getElementById('age').value,
        province: provinceName,
        district: districtName,
        subdistrict: subdistrictName,
        postalCode: document.getElementById('postalCode').value,
        additionalAddress: document.getElementById('additionalAddress').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        comments: document.getElementById('comments').value,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    complaintsData.push(formData);
    localStorage.setItem('complaintsData', JSON.stringify(complaintsData));

    document.getElementById('successModal').style.display = 'block';
    setTimeout(() => {
        document.getElementById('successModal').style.display = 'none';
    }, 2500);

    document.getElementById('complaintForm').reset();
    document.getElementById('district').disabled = true;
    document.getElementById('subdistrict').disabled = true;
}

// ฟังก์ชันเลือกประเภทคำร้องเรียนจาก dropdown
function selectComplaintTypeFromDropdown() {
    const select = document.getElementById('complaintTypeSelect');
    selectComplaintType(select.value);
}

// ฟังก์ชันเลือกประเภทคำร้องเรียน
function selectComplaintType(type) {
    const formTitle = document.querySelector('.form-title');
    const complaintTypeInput = document.getElementById('complaintType');
    const typeSelect = document.getElementById('complaintTypeSelect');

    const titles = {
        'inquiry': 'ติดต่อสอบถามผ่านเว็บไซต์',
        'complaint': 'รับเรื่องร้องทุกข์ผ่านเว็บไซต์',
        'corruption': 'ร้องเรียนการทุจริตผ่านเว็บไซต์'
    };

    if (formTitle) formTitle.textContent = titles[type] || 'ติดต่อสอบถามผ่านเว็บไซต์';
    if (complaintTypeInput) complaintTypeInput.value = type;
    if (typeSelect) typeSelect.value = type;
}

// เข้าสู่ระบบ Admin
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;

    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminLoginForm').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        displayComplaintsList();
    } else {
        alert('รหัสผ่านไม่ถูกต้อง');
    }
}

// แสดงรายการคำร้อง
function displayComplaintsList() {
    const listContainer = document.getElementById('complaintsList');
    complaintsData = JSON.parse(localStorage.getItem('complaintsData')) || [];

    if (complaintsData.length === 0) {
        listContainer.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px;">ยังไม่มีข้อมูลคำร้อง</p>';
        return;
    }

    const typeNames = {
        'inquiry': 'ติดต่อสอบถาม',
        'complaint': 'รับเรื่องร้องทุกข์',
        'corruption': 'ร้องเรียนการทุจริต'
    };

    const statusNames = {
        'pending': 'ยังไม่ตรวจสอบ',
        'checked': 'ตรวจสอบแล้ว',
        'completed': 'เสร็จสิ้น'
    };

    listContainer.innerHTML = '<h4 style="margin-bottom:10px;color:#1e3a8a;">รายการคำร้องทั้งหมด: ' + complaintsData.length + ' รายการ</h4>';

    complaintsData.slice().reverse().forEach((complaint, reverseIndex) => {
        const actualIndex = complaintsData.length - 1 - reverseIndex;
        const date = new Date(complaint.timestamp).toLocaleString('th-TH');
        const isChecked = complaint.status === 'checked' || complaint.status === 'completed';
        const statusClass = isChecked ? 'status-checked' : 'status-pending';

        const item = document.createElement('div');
        item.className = 'complaint-item-admin';
        const address = [complaint.subdistrict, complaint.district, complaint.province, complaint.postalCode]
            .filter(Boolean).join(', ');
        const additionalAddr = complaint.additionalAddress ? `${complaint.additionalAddress}, ` : '';

        item.innerHTML = `
            <div class="complaint-header-row">
                <div>
                    <span class="complaint-id-tag">${complaint.id}</span>
                    <span class="complaint-type-tag">${typeNames[complaint.type] || complaint.type}</span>
                </div>
                <label class="status-checkbox-label">
                    <input type="checkbox" ${isChecked ? 'checked' : ''}
                           onchange="toggleComplaintStatus(${actualIndex})" />
                    <span class="status-badge ${statusClass}">${statusNames[complaint.status] || 'ยังไม่ตรวจสอบ'}</span>
                </label>
            </div>
            <div class="detail-grid-admin">
                <div class="detail-row-admin"><span class="detail-label-admin">ชื่อ</span><span>${complaint.name}</span></div>
                <div class="detail-row-admin"><span class="detail-label-admin">เพศ</span><span>${complaint.gender || '-'}</span></div>
                <div class="detail-row-admin"><span class="detail-label-admin">อายุ</span><span>${complaint.age ? complaint.age + ' ปี' : '-'}</span></div>
                <div class="detail-row-admin"><span class="detail-label-admin">โทรศัพท์</span><span>${complaint.phone}</span></div>
                <div class="detail-row-admin"><span class="detail-label-admin">อีเมล</span><span>${complaint.email}</span></div>
                <div class="detail-row-admin"><span class="detail-label-admin">วันที่</span><span>${date}</span></div>
                <div class="detail-row-admin"><span class="detail-label-admin">ที่อยู่</span><span>${additionalAddr}${address || '-'}</span></div>
                <div class="detail-row-admin"><span class="detail-label-admin">รายละเอียด</span><span>${complaint.comments || '-'}</span></div>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

// เปลี่ยนสถานะคำร้อง
function toggleComplaintStatus(index) {
    complaintsData = JSON.parse(localStorage.getItem('complaintsData')) || [];
    if (complaintsData[index]) {
        complaintsData[index].status = complaintsData[index].status === 'pending' ? 'checked' : 'pending';
        localStorage.setItem('complaintsData', JSON.stringify(complaintsData));
        displayComplaintsList();
    }
}

// ดาวน์โหลดข้อมูลเป็น JSON
function downloadComplaints() {
    complaintsData = JSON.parse(localStorage.getItem('complaintsData')) || [];
    if (complaintsData.length === 0) { alert('ไม่มีข้อมูลให้ดาวน์โหลด'); return; }
    const blob = new Blob([JSON.stringify(complaintsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'complaints_' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ดาวน์โหลดข้อมูลเป็น CSV
function downloadCSV() {
    complaintsData = JSON.parse(localStorage.getItem('complaintsData')) || [];
    if (complaintsData.length === 0) { alert('ไม่มีข้อมูลให้ดาวน์โหลด'); return; }

    const typeNames = { 'inquiry': 'ติดต่อสอบถาม', 'complaint': 'รับเรื่องร้องทุกข์', 'corruption': 'ร้องเรียนการทุจริต' };
    const headers = ['ID','ประเภท','ชื่อ-นามสกุล','จังหวัด','อำเภอ','ตำบล','รหัสไปรษณีย์','ที่อยู่เพิ่มเติม','โทรศัพท์','อีเมล','ความคิดเห็น','วันเวลา','สถานะ'];
    const rows = complaintsData.map(c => [
        c.id, typeNames[c.type] || c.type, c.name, c.province, c.district, c.subdistrict,
        c.postalCode, c.additionalAddress, c.phone, c.email,
        (c.comments || '').replace(/\n/g, ' '),
        new Date(c.timestamp).toLocaleString('th-TH'), c.status
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map(row =>
        row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'complaints_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

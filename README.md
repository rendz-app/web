# เว็บ อบต. ลาดบัวขาว

เว็บไซต์องค์การบริหารส่วนตำบลลาดบัวขาว จังหวัดราชบุรี — ออกแบบแบบ mobile-first ใช้ Tailwind CSS ผ่าน CDN

## โครงสร้างโปรเจกต์

```
c:\web\
├── index.html       # หน้าแรก (root)
├── contact.html     # ติดต่ออบต.
├── personel.html    # บุคลากร
├── js/
│   └── main.js      # เมนูมือถือ, ปุ่มกลับขึ้นบน
├── images/          # รูปโลโก้ / ภาพกิจกรรม (ใส่ไฟล์ตามต้องการ)
└── README.md
```

## การรัน / เปิดดู

- เปิดไฟล์ `index.html` ในเบราว์เซอร์จะถูกนำไปหน้าแรก `index.html` โดยตรง
- หรือใช้ Live Server ใน VS Code / Cursor เพื่อรัน local server (แนะนำถ้าต้องการทดสอบลิงก์และ path)

## เทคโนโลยี

- **HTML5** + **Tailwind CSS (CDN)** + **Vanilla JavaScript**
- สีหลัก: น้ำเงิน `#1E3A8A` (obt-blue), ส้ม `#F97316` (obt-orange)
- ฟอนต์: Prompt (Google Fonts)

## การ deploy

อัปโหลดโฟลเดอร์ทั้งหมดไปยังเว็บโฮสติ้ง (เช่น Netlify, Vercel, หรือเซิร์ฟเวอร์ของ อบต.) โดยไม่ต้อง build — ใช้ได้ทันทีเพราะเป็น static HTML + CDN

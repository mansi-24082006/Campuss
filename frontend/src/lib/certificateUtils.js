import { jsPDF } from "jspdf";

/**
 * Generates a professional PDF certificate for an event.
 * @param {Object} data - The data for the certificate.
 * @param {string} data.studentName - The name of the student.
 * @param {string} data.eventTitle - The name of the event.
 * @param {string} data.date - The date of the event.
 * @param {string} data.organizer - The organizer of the event.
 * @param {string} data.certificateId - A unique ID for the certificate.
 */
export const generateCertificate = async ({ studentName, eventTitle, date, organizer, certificateId }) => {
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Background Decor ---
    doc.setFillColor(248, 250, 252); // Soft slate background
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Decorative corner accents (indigo)
    doc.setFillColor(79, 70, 229);
    doc.triangle(0, 0, 40, 0, 0, 40, "F");
    doc.setFillColor(236, 72, 153); // pink
    doc.triangle(pageWidth, pageHeight, pageWidth - 40, pageHeight, pageWidth, pageHeight - 40, "F");

    // Border
    doc.setLineWidth(1.5);
    doc.setDrawColor(79, 70, 229); // Indigo border
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(32);
    doc.text("CampusBuzz", pageWidth / 2, 35, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("OFFICIAL EVENT RECOGNITION", pageWidth / 2, 42, { align: "center" });

    // --- Title ---
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(42);
    doc.text("CERTIFICATE", pageWidth / 2, 75, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("OF APPRECIATION", pageWidth / 2, 85, { align: "center" });

    // --- Body ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.setTextColor(71, 85, 105);
    doc.text("This certificate is proudly presented to", pageWidth / 2, 105, { align: "center" });

    // Student Name with a underline
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(32);
    doc.setTextColor(15, 23, 42);
    doc.text(studentName || "Valued Participant", pageWidth / 2, 122, { align: "center" });
    
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 60, 125, pageWidth / 2 + 60, 125);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(71, 85, 105);
    doc.text(`for their outstanding participation and contribution to the event`, pageWidth / 2, 140, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(79, 70, 229);
    doc.text(eventTitle || "Campus Event", pageWidth / 2, 155, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    const eventDate = new Date(date).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    doc.text(`Presented on ${eventDate}`, pageWidth / 2, 165, { align: "center" });

    // --- Footer ---
    // QR Code Placement (Floating)
    const qrSize = 30;
    const qrX = pageWidth - 50;
    const qrY = pageHeight - 65;
    
    // Add a placeholder/instruction for verification
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Scan to verify authenticity", qrX + qrSize/2, qrY + qrSize + 5, { align: "center" });

    // Use a public QR code API to fetch the QR code and add it to the PDF
    const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;
    
    try {
        // We add the image asynchronously if possible, or just skip if it fails
        // In jsPDF, we can add image from URL by first loading it
        const img = new Image();
        img.src = qrCodeUrl;
        img.crossOrigin = "Anonymous";
        
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
        doc.addImage(img, 'PNG', qrX, qrY, qrSize, qrSize);
    } catch (e) {
        console.error("Failed to add QR code to certificate", e);
    }

    // Signature Lines
    doc.setDrawColor(200);
    doc.line(40, 200, 100, 200);
    doc.line(pageWidth - 140, 200, pageWidth - 80, 200);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(organizer || "Event Organizer", 70, 207, { align: "center" });
    doc.text("CampusBuzz Authorized", pageWidth - 110, 207, { align: "center" });

    // Certificate ID
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.setFont("courier", "bold");
    doc.text(`CERTIFICATE ID: ${certificateId}`, 15, pageHeight - 12);

    // Save with sanitized name
    const fileName = `Certificate_${eventTitle.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
};

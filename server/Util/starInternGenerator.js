import fs from "fs";
import PDFDocument from "pdfkit";

const COLORS = {
  primary: "#1a365d",    
  secondary: "#2b6cb0", 
  accent: "#4299e1",    
  gold: "#d4af37",      
  text: "#2d3748",      
  subtext: "#4a5568"    
};

const FONTS = {
  title: "Helvetica-Bold",
  subtitle: "Helvetica",
  body: "Helvetica",
  decorative: "Helvetica-Oblique"
};

const getCertificateContent = (name, post, duration, department) => {
  const formattedPost = post.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');

  return {
    title: "StarIntern",
    subtitle: "Outstanding Achievement Award",
    organization: "Renu Sharma Healthcare Education & Foundation",
    mainContent: {
      recipient: name,
      position: formattedPost,
      department: department,
      // Remove duplicate "months"
      duration: `${duration}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    achievements: [
      "Demonstrated exceptional proficiency in clinical practices",
      "Exhibited outstanding leadership and interpersonal skills",
      "Contributed significantly to patient care and team success",
      // "Maintained highest standards of medical ethics and professionalism"
    ],
    endorsement: "This certificate recognizes outstanding dedication and excellence in healthcare education.",
    folderPath: "starInternCertificate",
    certificationNumber: `HC-${Date.now().toString(36).toUpperCase()}`
  };
};

const drawBorder = (doc) => {
  const padding = 20;
  // Outer border (gold)
  doc.save()
     .lineWidth(2)
     .strokeColor(COLORS.gold)
     .rect(padding, padding, doc.page.width - (padding * 2), doc.page.height - (padding * 2))
     .stroke();
  
  // Inner border (navy)
  doc.rect(padding + 10, padding + 10, doc.page.width - (padding * 2 + 20), doc.page.height - (padding * 2 + 20))
     .strokeColor(COLORS.primary)
     .lineWidth(1)
     .stroke()
     .restore();
};

const generateStarInternCertificate = async (name, email, post, duration, department) => {
  return new Promise(async (resolve, reject) => {
    try {
      const template = getCertificateContent(name, post, duration, department);
      if (!fs.existsSync(template.folderPath)) {
        fs.mkdirSync(template.folderPath, { recursive: true });
      }

      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 50
      });

      const buffers = [];
      const certificatePath = `${template.folderPath}/${name.replace(/\s+/g, '_')}_certificate.pdf`;
      const writeStream = fs.createWriteStream(certificatePath);

      doc.on("data", buffers.push.bind(buffers));
      doc.pipe(writeStream);

      // Draw borders
      drawBorder(doc);

      // Organization name
      doc.fontSize(24)
         .font(FONTS.title)
         .fillColor(COLORS.primary)
         .text(template.organization, {
           align: "center",
           width: doc.page.width - 100
         });

      // Title
      doc.moveDown(0.8)
         .fontSize(36)
         .text(template.title, {
           align: "center",
           width: doc.page.width - 100
         });

      // Subtitle
      doc.moveDown(0.3)
         .fontSize(18)
         .font(FONTS.subtitle)
         .fillColor(COLORS.secondary)
         .text(template.subtitle, {
           align: "center",
           width: doc.page.width - 100
         });

      // Main content
      doc.moveDown(1)
         .fontSize(16)
         .font(FONTS.body)
         .fillColor(COLORS.text)
         .text("This is to certify that", {
           align: "center",
           width: doc.page.width - 100
         });

      doc.moveDown(0.5)
         .fontSize(24)
         .font(FONTS.decorative)
         .fillColor(COLORS.primary)
         .text(template.mainContent.recipient, {
           align: "center",
           width: doc.page.width - 100
         });

      doc.moveDown(0.5)
         .fontSize(16)
         .font(FONTS.body)
         .fillColor(COLORS.text)
         .text("has demonstrated exceptional performance as", {
           align: "center",
           width: doc.page.width - 100
         });

      doc.moveDown(0.5)
         .fontSize(20)
         .font(FONTS.title)
         .fillColor(COLORS.secondary)
         .text(template.mainContent.position, {
           align: "center",
           width: doc.page.width - 100
         });

      doc.moveDown(0.3)
         .fontSize(16)
         .font(FONTS.body)
         .fillColor(COLORS.text)
         .text("in it", {
           align: "center",
           width: doc.page.width - 100
         });

      doc.moveDown(0.3)
         .text(`for a duration of ${template.mainContent.duration}`, {
           align: "center",
           width: doc.page.width - 100
         });

      // Achievements
      doc.moveDown(1)
         .fontSize(14)
         .fillColor(COLORS.subtext);

      template.achievements.forEach(achievement => {
        doc.text(`• ${achievement}`, {
          align: "center",
          width: doc.page.width - 200,
          indent: 50
        });
        doc.moveDown(0.5);
      });

      // Endorsement
      doc.moveDown(0.5)
         .fontSize(14)
         .text(template.endorsement, {
           align: "center",
           width: doc.page.width - 100
         });

      // Adjusted bottom section layout
      const bottomY = doc.page.height - 80;
      
      // Certificate number (left side)
      doc.fontSize(10)
         .font(FONTS.body)
         .fillColor(COLORS.subtext)
         .text(`Certificate No: ${template.certificationNumber}`, 50, bottomY);

      // Director title (center)
      doc.fontSize(12)
         .font(FONTS.title)
         .fillColor(COLORS.primary)
         .text("_______________________", doc.page.width / 2 - 100, bottomY , { align: "center" })
         .fontSize(10)
         .text("Director of Healthcare Education", doc.page.width / 2 - 100, bottomY, { align: "center" });

      // Issue date (right side)
      doc.fontSize(10)
         .font(FONTS.body)
         .fillColor(COLORS.subtext)
         .text(`Issued on: ${template.mainContent.date}`, 
               doc.page.width - 250, 
               bottomY, 
               { align: "right" });

      doc.end();

      writeStream.on("finish", () => {
        console.log(`Certificate generated: ${certificatePath}`);
        resolve({ path: certificatePath, buffer: Buffer.concat(buffers) });
      });

      writeStream.on("error", (error) => {
        reject(new Error(`Error writing certificate: ${error.message}`));
      });
    } catch (error) {
      reject(new Error(`Certificate generation failed: ${error.message}`));
    }
  });
};

export default generateStarInternCertificate;
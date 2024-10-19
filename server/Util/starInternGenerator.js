import fs from "fs";
import PDFDocument from "pdfkit";

const COLORS = {
  primary: "#1a365d",    // Deep blue for main elements
  secondary: "#2b6cb0",  // Medium blue for secondary elements
  accent: "#4299e1",     // Light blue for highlights
  gold: "#d4af37",       // Gold for decorative elements
  text: "#2d3748",       // Dark gray for main text
  subtext: "#4a5568"     // Medium gray for secondary text
};

const FONTS = {
  title: "Helvetica-Bold",
  subtitle: "Helvetica",
  body: "Helvetica",
  decorative: "Helvetica-Oblique"
};

const getCertificateContent = (name, post, duration) => {
  // Format the post title to be more prominent
  const formattedPost = post.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');

  return {
    title: "Certificate of Excellence",
    subtitle: "Outstanding Achievement Award",
    organization: {
      name: "Renu Sharma Healthcare Education & Foundation",
      tagline: "Nurturing Tomorrow's Healthcare Leaders",
      location: "Excellence in Healthcare Education"
    },
    mainContent: {
      recipient: name,
      position: formattedPost,
      duration: duration,
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
      "Maintained highest standards of medical ethics and professionalism"
    ],
    endorsement: "This certificate recognizes outstanding dedication and excellence in healthcare education.",
    impactStatement: `${name}'s contributions have significantly enhanced our healthcare initiatives and patient care standards.`,
    closingStatement: "We are confident that their expertise will continue to advance healthcare excellence.",
    folderPath: "starInternCertificate",  // Restored original folder path
    certificationNumber: `HC-${Date.now().toString(36).toUpperCase()}`
  };
};

const drawBorder = (doc) => {
  // Elegant border design
  const padding = 20;
  doc.save()
     .lineWidth(2)
     .strokeColor(COLORS.gold)
     .rect(padding, padding, doc.page.width - (padding * 2), doc.page.height - (padding * 2))
     .stroke()
     
  // Inner decorative border
  doc.rect(padding + 10, padding + 10, doc.page.width - (padding * 2 + 20), doc.page.height - (padding * 2 + 20))
     .strokeColor(COLORS.primary)
     .lineWidth(1)
     .stroke()
     .restore();
};

const drawHeader = (doc, template) => {
  // Organization logo placeholder (you can add the actual logo)
  doc.save()
     .translate(doc.page.width / 2, 100)
     .fontSize(28)
     .fillColor(COLORS.primary)
     .font(FONTS.title)
     .text(template.organization.name, { align: "center" })
     .restore();
};

const drawDecorative = (doc) => {
  // Add decorative elements
  const centerX = doc.page.width / 2;
  
  // Draw decorative lines
  doc.save()
     .translate(centerX, 150)
     .lineWidth(3)
     .strokeColor(COLORS.gold)
     .moveTo(-100, 0)
     .lineTo(100, 0)
     .stroke()
     .restore();
};

const generateStarInternCertificate = async (name, email, post, duration) => {
  console.log("Generating certificate for:", name, email, post);
  return new Promise(async (resolve, reject) => {
    try {
      const template = getCertificateContent(name, post, duration);
      if (!fs.existsSync(template.folderPath)) {
        fs.mkdirSync(template.folderPath, { recursive: true });
      }

      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 50,
        info: {
          Title: `Certificate of Excellence - ${name}`,
          Author: template.organization.name,
          Subject: "Healthcare Excellence Certificate",
          Keywords: "healthcare, education, excellence, certificate"
        }
      });

      const buffers = [];
      const certificatePath = `${template.folderPath}/${name.replace(/\s+/g, '_')}_star_intern_certificate.pdf`;
      const writeStream = fs.createWriteStream(certificatePath);

      doc.on("data", buffers.push.bind(buffers));
      doc.pipe(writeStream);

      // Background and borders
      drawBorder(doc);
      
      // Organization header
      drawHeader(doc, template);
      
      // Decorative elements
      drawDecorative(doc);

      // Main content
      doc.fontSize(36)
         .font(FONTS.title)
         .fillColor(COLORS.primary)
         .text(template.title, { align: "center" });

      doc.moveDown(0.5)
         .fontSize(18)
         .font(FONTS.subtitle)
         .fillColor(COLORS.secondary)
         .text(template.subtitle, { align: "center" });

      doc.moveDown(1.5)
         .fontSize(16)
         .font(FONTS.body)
         .fillColor(COLORS.text)
         .text("This is to certify that", { align: "center" });

      doc.moveDown(0.5)
         .fontSize(24)
         .font(FONTS.decorative)
         .fillColor(COLORS.primary)
         .text(template.mainContent.recipient, { align: "center" });

      doc.moveDown(0.5)
         .fontSize(16)
         .font(FONTS.body)
         .fillColor(COLORS.text)
         .text(`has demonstrated exceptional performance as`, { align: "center" });

      doc.moveDown(0.5)
         .fontSize(20)
         .font(FONTS.title)
         .fillColor(COLORS.secondary)
         .text(template.mainContent.position, { align: "center" });

      doc.moveDown(0.5)
         .fontSize(16)
         .font(FONTS.body)
         .fillColor(COLORS.text)
         .text(`for a duration of ${template.mainContent.duration}`, { align: "center" });

      // Achievements section
      doc.moveDown(1.5)
         .fontSize(14)
         .font(FONTS.body)
         .fillColor(COLORS.subtext);

      template.achievements.forEach(achievement => {
        doc.text(`• ${achievement}`, { align: "center" });
        doc.moveDown(0.3);
      });

      // Footer section
      doc.moveDown(1)
         .fontSize(12)
         .text(template.endorsement, { align: "center" });

      // Certification number and date
      doc.moveDown(1.5)
         .fontSize(10)
         .font(FONTS.body)
         .fillColor(COLORS.subtext)
         .text(`Certificate No: ${template.certificationNumber}`, { align: "left" })
         .text(`Issued on: ${template.mainContent.date}`, { align: "left" });

      // Signature placeholder
      doc.moveDown(1)
         .fontSize(12)
         .font(FONTS.title)
         .fillColor(COLORS.primary)
         .text("_______________________", { align: "right" })
         .moveDown(0.2)
         .fontSize(10)
         .text("Director of Healthcare Education", { align: "right" });

      doc.end();

      writeStream.on("finish", async () => {
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
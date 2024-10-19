import fs from "fs";
import PDFDocument from "pdfkit";

const getCertificateContent = (
  certificateName,
  name,
  post,
  startDate,
  endDate,
  tenure
) => {
  const templates = {
    icc: {
      title: "Certificate of Internship Completion",
      subtitle: "Excellence in Professional Development",
      organization: {
        name: "Renu Sharma Healthcare Education & Foundation",
        tagline: "Nurturing Tomorrow's Healthcare Leaders",
      },
      mainContent: `With great pleasure, we hereby certify that\n\n${name}\n\nhas successfully completed an intensive internship program as\n\n${post}\n\nat Renu Sharma Healthcare Education & Foundation, demonstrating exceptional proficiency and dedication throughout their tenure of ${tenure}, from ${startDate} to ${endDate}.`,
      achievements: [
        "Demonstrated outstanding professional growth and learning aptitude",
        "Contributed significantly to organizational objectives",
        "Exhibited strong leadership and teamwork qualities",
        "Maintained highest standards of professional conduct"
      ],
      endorsement: "Throughout the internship period, the candidate has shown remarkable initiative, intellectual curiosity, and a commitment to excellence that exemplifies the values of our organization.",
      impactStatement: "Their contributions have made a lasting positive impact on our projects and team dynamics.",
      closingStatement: "We are confident that their experience here will serve as a strong foundation for their future professional endeavors.",
      folderPath: "iccCertificate",
      certificationNumber: `ICC-${Date.now().toString(36).toUpperCase()}`
    },
  };

  return templates[certificateName.toLowerCase()] || templates.icc;
};

const generateCertificate = async (
  name,
  email,
  post,
  startDate,
  endDate,
  tenure,
  certificateName
) => {
  console.log("inside icc generator", name, email, post, startDate, endDate, tenure, certificateName);
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure directory exists
      const template = getCertificateContent(certificateName, name, post, startDate, endDate, tenure);
      if (!fs.existsSync(template.folderPath)) {
        fs.mkdirSync(template.folderPath, { recursive: true });
      }

      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        layout: "landscape"
      });
    
      const buffers = [];
      const certificatePath = `${template.folderPath}/${name}_certificate.pdf`;
      const writeStream = fs.createWriteStream(certificatePath);

      doc.on("data", buffers.push.bind(buffers));
      doc.pipe(writeStream);

      // Background styling
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("#FFFFFF");
    
      // Decorative border
      const borderWidth = 20;
      doc.rect(borderWidth, borderWidth, doc.page.width - (borderWidth * 2), 
               doc.page.height - (borderWidth * 2))
         .lineWidth(2)
         .stroke("#234E70");

      // Inner border
      doc.rect(borderWidth + 10, borderWidth + 10, 
               doc.page.width - (borderWidth * 2) - 20, 
               doc.page.height - (borderWidth * 2) - 20)
         .lineWidth(0.5)
         .stroke("#2A9D8F");

      try {
        // Background watermark
        const backgroundImagePath = "images/logo-image.png";
        if (fs.existsSync(backgroundImagePath)) {
          const backgroundImage = fs.readFileSync(backgroundImagePath);
          doc.image(backgroundImage, doc.page.width / 2 - 100, doc.page.height / 2 - 100, {
            width: 200,
            height: 200,
            opacity: 0.06
          });
        }
      } catch (error) {
        console.warn("Logo image not found, continuing without watermark");
      }

      // Header Section
      doc.font('Helvetica-Bold')
         .fontSize(36)
         .fillColor("#1D3557")
         .text(template.title, { align: "center" })
         .moveDown(0.3);

      doc.font('Helvetica')
         .fontSize(18)
         .fillColor("#2A9D8F")
         .text(template.subtitle, { align: "center" })
         .moveDown(1);

      // Organization details
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor("#234E70")
         .text(template.organization.name, { align: "center" })
         .moveDown(0.3);

      doc.font('Helvetica')
         .fontSize(16)
         .fillColor("#2A9D8F")
         .text(template.organization.tagline, { align: "center" })
         .moveDown(1.5);

      // Main content
      doc.font('Helvetica')
         .fontSize(14)
         .fillColor("#1D3557")
         .text(template.mainContent, { align: "center" })
         .moveDown(1.5);

      // Achievements section
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor("#2A9D8F");
    
      template.achievements.forEach(achievement => {
        doc.text(`• ${achievement}`, { align: "center" })
           .moveDown(0.5);
      });
      doc.moveDown(1);

      // Endorsement
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor("#234E70")
         .text(template.endorsement, { align: "center" })
         .moveDown(0.5)
         .text(template.impactStatement, { align: "center" })
         .moveDown(0.5)
         .text(template.closingStatement, { align: "center" })
         .moveDown(2);

      // Signature section
      const signatureY = doc.y;
    
      // Left signature
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor("#1D3557")
         .text("________________________", doc.page.width / 4, signatureY, { align: "center" })
         .text("Program Director", doc.page.width / 4, signatureY + 20, { align: "center" });

      // Right signature
      doc.text("________________________", (doc.page.width * 3) / 4, signatureY, { align: "center" })
         .text("Chief Executive Officer", (doc.page.width * 3) / 4, signatureY + 20, { align: "center" });

      // Certificate footer
      doc.font('Helvetica')
         .fontSize(10)
         .fillColor("#2A9D8F")
         .text(`Certificate ID: ${template.certificationNumber}`, { align: "center" })
         .moveDown(0.5)
         .text(`Issued on: ${new Date().toLocaleDateString()}`, { align: "center" });

      // Finishing touches
      doc.end();

      writeStream.on("finish", async () => {
        console.log(`Certificate generated: ${certificatePath}`);
        try {
          console.log(`Certificate stored for ${email}`);
          resolve({ path: certificatePath, buffer: Buffer.concat(buffers) });
        } catch (error) {
          reject(new Error(`Error storing certificate: ${error.message}`));
        }
      });

      writeStream.on("error", (error) => {
        reject(new Error(`Error writing certificate: ${error.message}`));
      });

    } catch (error) {
      reject(new Error(`Certificate generation failed: ${error.message}`));
    }
  });
};

export default generateCertificate;
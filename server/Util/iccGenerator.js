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
      mainContent: `With great pleasure, we hereby certify that\n\n${name}\n\nhas successfully completed an intensive internship program as\n\n${post}\n\nfrom ${startDate} to ${endDate} at Renu Sharma Healthcare Education & Foundation, demonstrating exceptional proficiency and dedication throughout their ${tenure} tenure.`,
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
    starintern: {
      title: "Star Intern Award Certificate",
      subtitle: "Celebrating Outstanding Performance",
      organization: {
        name: "Renu Sharma Healthcare Education & Foundation",
        tagline: "Nurturing Tomorrow's Healthcare Leaders",
      },
      mainContent: `This certifies that\n\n${name}\n\nhas been awarded the title of\n\nStar Intern\n\nfor their exceptional performance as a\n\n${post}\n\nat Renu Sharma Healthcare Education & Foundation, demonstrating remarkable dedication and proficiency throughout their internship.`,
      achievements: [
        "Consistently exceeded performance expectations",
        "Displayed outstanding leadership and teamwork skills",
        "Made significant contributions to projects",
        "Maintained high standards of professionalism"
      ],
      endorsement: "Their exemplary conduct and enthusiasm reflect the core values of our organization.",
      impactStatement: `The contributions made by ${name} have had a profound impact on our team and projects.`,
      closingStatement: "We are confident that their skills and experiences will be invaluable in their future endeavors.",
      folderPath: "starInternCertificate",
      certificationNumber: `STAR-${Date.now().toString(36).toUpperCase()}`
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
  console.log("Generating certificate for:", name, email, post, certificateName);
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

      // Background styling and rest of the PDF creation (same as before)
      // ...

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


import fs from "fs";
import PDFDocument from "pdfkit";

const getCertificateContent = (certificateName, name, post) => {
  const templates = {
    lor: {
      subject: "Letter of Recommendation",
      mainContent: `I am writing to highly recommend ${name}, who worked as a ${post} at Renu Sharma Healthcare Education & Foundation. Throughout their time with us, ${name} has consistently demonstrated exceptional skills, strong work ethic, and outstanding professional conduct.`,
      closingContent: `${name} has proven to be a valuable team member with excellent technical and interpersonal skills. Their dedication and capability to learn and adapt quickly make them an asset to any organization.`,
      finalMessage:
        "I confidently recommend them for any future opportunities they may pursue.",
      congratsMessage: "Best wishes for your future endeavors!",
      folderPath: "lorCertificate",
    },
  };

  return templates[certificateName.toLowerCase()] || templates.lor;
};
const generateCertificate = async (name, email, post, certificateName) => {
  console.log(name, email, post, certificateName);
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    const template = getCertificateContent(certificateName, name, post);
    const certificatePath = `${template.folderPath}/${name}_certificate.pdf`;
    const writeStream = fs.createWriteStream(certificatePath);

    // Pipe the PDF document to buffers array
    doc.on("data", buffers.push.bind(buffers));

    // Pipe the PDF document to write stream to save locally
    doc.pipe(writeStream);

    const backgroundImagePath = "images/logo-image.png";
    const backgroundImage = fs.readFileSync(backgroundImagePath);

    // Draw the background image
    doc.image(backgroundImage, 0, 60, {
      width: doc.page.width + 2,
      height: doc.page.height - 210,
      opacity: 0.8,
    });

    doc.font("Helvetica");

    // Add other PDF content (header, address, etc.) based on the template
    doc
      .fontSize(20)
      .fillColor("green")
      .font("Helvetica-Bold")
      .text("Renu Sharma Healthcare Education & Foundation", { align: "left" });
    doc.moveDown();
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("black")
      .text("Gurugram, Haryana", { align: "left" })
      .text("Sector - 14", { align: "left" })
      .text("Pincode: 122503", { align: "left" });
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });
    doc.moveDown();
    doc.text(`Subject: ${template.subject}`, { align: "left" });
    doc.moveDown();
    doc.text(`Dear ${name},`, { align: "left" });
    doc.moveDown();
    doc.text(template.mainContent, { align: "left" });
    doc.moveDown();
    doc.text(template.closingContent, { align: "left" });
    doc.moveDown();
    doc.text(template.finalMessage, { align: "left" });
    doc.moveDown();
    doc.text(template.congratsMessage, { align: "left" });
    doc.moveDown();
    doc.text(`Name - ${name}`, { align: "left" });

    // Add bottom border
    doc
      .lineWidth(25)
      .strokeColor("#000080")
      .moveTo(0, doc.page.height - 50)
      .lineTo(doc.page.width, doc.page.height - 50)
      .stroke();

    doc.end();

    writeStream.on("finish", async () => {
      console.log(
        `Certificate generated and stored locally at: ${certificatePath}`
      );
      const pdfBuffer = fs.readFileSync(certificatePath);

      try {
        console.log(`Certificate stored in the database for ${email}`);
        resolve({ path: certificatePath, buffer: Buffer.concat(buffers) });
      } catch (error) {
        console.error(
          `Error storing certificate in the database: ${error.message}`
        );
        reject(error);
      }
    });

    writeStream.on("error", (error) => {
      console.error(`Error generating certificate: ${error.message}`);
      reject(error);
    });
  });
};

export default generateCertificate;

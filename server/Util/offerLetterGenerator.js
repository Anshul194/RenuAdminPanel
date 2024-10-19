import fs from "fs";
import PDFDocument from "pdfkit";

const getCertificateContent = (name, post, startDate, endDate, tenure) => {
  return {
    subject: `Offer letter of ${post}`,
    mainContent: `We are thrilled to extend an offer of employment for the position of ${post} intern at Renu Sharma Healthcare Education & Foundation. We were impressed by your qualifications and experience, and we believe that you will make a valuable addition to our team.`,
    closingContent: `To accept this offer, please sign and return this letter by 3 days from now. If you have any questions or concerns, please do not hesitate to contact us at `,
    finalMessage:
      "We are excited about the possibility of you joining our team and look forward to your positive response.",
    congratsMessage: "Congratulations!",
    folderPath: "offerletter",
    startDate: startDate ? `Start Date: ${startDate}` : "",
    endDate: endDate ? `End Date: ${endDate}` : "",
    tenure: tenure ? `Tenure: ${tenure}` : "",
  };
};

const generateCertificate = async (
  name,
  email,
  post,
  startDate,
  endDate,
  tenure
) => {
  console.log(name, email, post, startDate, endDate, tenure);
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    const template = getCertificateContent(
      name,
      post,
      startDate,
      endDate,
      tenure
    );
    const certificatePath = `${template.folderPath}/${name}_certificate.pdf`;
    const writeStream = fs.createWriteStream(certificatePath);

    // Pipe the PDF document to buffers array
    doc.on("data", buffers.push.bind(buffers));
    // Pipe the PDF document to write stream to save locally
    doc.pipe(writeStream);

    const backgroundImagePath = "images/logo-image.png";
    const backgroundImage = fs.readFileSync(backgroundImagePath);

    // Define the upper margin
    const upperMargin = 60;

    // Draw the background image with the upper margin
    doc.image(backgroundImage, 0, upperMargin, {
      width: doc.page.width + 2,
      height: doc.page.height - 210,
      opacity: 0.8,
    });

    doc.font("Helvetica");

    // Header
    doc
      .fontSize(20)
      .fillColor("green")
      .font("Helvetica-Bold")
      .text("Renu Sharma Healthcare Education & Foundation", { align: "left" });
    doc.moveDown();

    // Address
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("black")
      .text("Gurugram, Haryana", { align: "left" })
      .text("Sector - 14", { align: "left" })
      .text("Pincode: 122503", { align: "left" })
      .moveDown();

    if (template.startDate)
      doc.text(template.startDate, { align: "left" }).moveDown();
    if (template.endDate)
      doc.text(template.endDate, { align: "left" }).moveDown();
    if (template.tenure)
      doc.text(template.tenure, { align: "left" }).moveDown();

    // Date
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });
    doc.moveDown();

    // Subject
    doc.text(`Subject: ${template.subject}`, { align: "left" });
    doc.moveDown();

    // Salutation
    doc.text(`Dear ${name},`, { align: "left" });
    doc.moveDown();

    // Main content
    doc.text(template.mainContent, { align: "left" });
    doc.moveDown();

    // Closing content
    doc
      .text(template.closingContent, { continued: true })
      .font("Helvetica-Bold")
      .text("9671457366", { continued: true })
      .font("Helvetica")
      .text(" or ", { continued: true })
      .font("Helvetica-Bold")
      .text("Neha.rshefoundation@gmail.com");
    doc.moveDown();

    // Final message
    doc.text(template.finalMessage, { align: "left" });
    doc.moveDown();

    // Congratulatory message
    doc.text(template.congratsMessage, { align: "left" });
    doc.moveDown();

    // Additional information if available
    // Name
    doc.text(`Name - ${name}`, { align: "left" });

    // Bottom border
    doc.lineWidth(25);
    doc.strokeColor("#000080");
    doc
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

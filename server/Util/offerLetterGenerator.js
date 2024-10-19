import fs from "fs";
import PDFDocument from "pdfkit";

const getCertificateContent = (name, post, startDate, endDate, tenure, department) => {
  return {
    subject: `Offer Letter for ${post}`,
    congratulatoryMessage: `Congratulations, ${name}!`,
    mainContent: `We are thrilled to extend an offer of internship for the position of ${post} intern in the ${department} at Renu Sharma Healthcare Education & Foundation. We were impressed by your qualifications and experience, and we believe that you will make a valuable addition to our team.`,
    closingContent: `To accept this offer, please sign and return this letter within 3 days from now. If you have any questions or concerns, please do not hesitate to contact us at`,
    finalMessage: "We are excited about the possibility of you joining our team and look forward to your positive response.",
    footerAddress: "VPO Baspadmka\nTeh Pataudi\nDist Gurugram (HR)\nPin 122503",
    contact: "Contact: 9671457366\nEmail: Neha.rshefoundation@gmail.com",
    date: new Date().toLocaleDateString(),
    folderPath: "offerletter",
    startDate: startDate ? `Start Date: ${startDate}` : "",
    endDate: endDate ? `End Date: ${endDate}` : "",
    tenure: tenure ? `Tenure: ${tenure}` : ""
  };
};

const generateCertificate = async (
  name,
  email,
  post,
  startDate,
  endDate,
  tenure,
  department
) => {
  console.log(name, email, post, startDate, endDate, tenure, department);
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    const buffers = [];
    const template = getCertificateContent(
      name,
      post,
      startDate,
      endDate,
      tenure,
      department
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

    // Draw the background image with low opacity for a transparent effect
    doc.image(backgroundImage, 0, upperMargin, {
      width: doc.page.width + 2,
      height: doc.page.height - 210,
      opacity: 0.001, // Very low opacity for shadow-like effect
    });

    doc.font("Helvetica");

    // Header
    doc
      .fontSize(20)
      .fillColor("#000080") // Set header color to blue
      .font("Helvetica-Bold")
      .text("Renu Sharma Healthcare Education & Foundation", { align: "left" });
    doc.moveDown();

    // Date
    doc.fontSize(12).fillColor("black").text(`Date: ${template.date}`, { align: "left" }).moveDown();

    // Subject
    doc.fontSize(12).fillColor("black").text(`Subject: ${template.subject}`, { align: "left" }).moveDown();

    // Congratulatory message at the top
    doc
      .fontSize(12)
      .fillColor("black") // Set color for the congratulatory message
      .text(template.congratulatoryMessage, { align: "left" })
      .moveDown();

    // Salutation
    doc.text(`Dear ${name},`, { align: "left" }).moveDown();

    // Main content
    doc.fontSize(12).fillColor("black").text(template.mainContent, { align: "left" }).moveDown();

    // Additional Information
    if (template.startDate) doc.text(template.startDate, { align: "left" }).moveDown();
    if (template.endDate) doc.text(template.endDate, { align: "left" }).moveDown();
    if (template.tenure) doc.text(template.tenure, { align: "left" }).moveDown();

    // Closing content
    doc
      .font("Helvetica")
      .text(template.closingContent, { continued: true })
      .font("Helvetica-Bold")
      .text(" 9671457366", { continued: true })
      .font("Helvetica")
      .text(" or ", { continued: true })
      .font("Helvetica-Bold")
      .text("Neha.rshefoundation@gmail.com");
    doc.moveDown();

    // Final message
    doc.font("Helvetica").text(template.finalMessage, { align: "left" }).moveDown();

    // Bottom border
    doc.lineWidth(25);
    doc.strokeColor("#000080");
    doc
      .moveTo(0, doc.page.height - 50)
      .lineTo(doc.page.width, doc.page.height - 50)
      .stroke();

    // Footer address
    doc
      .fontSize(10)
      .fillColor("black")
      .text(template.footerAddress, { align: "left" })
      .moveDown();
    doc.text(template.contact, { align: "left" });

    doc.end();

    writeStream.on("finish", async () => {
      console.log(`Certificate generated and stored locally at: ${certificatePath}`);
      const pdfBuffer = fs.readFileSync(certificatePath);
      try {
        console.log(`Certificate stored in the database for ${email}`);
        resolve({ path: certificatePath, buffer: Buffer.concat(buffers) });
      } catch (error) {
        console.error(`Error storing certificate in the database: ${error.message}`);
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

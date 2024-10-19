import fs from "fs";
import PDFDocument from "pdfkit";

const getCertificateContent = (certificateName, name, post,department) => {
  const templates = {
    lor: {
      subject: "Letter of Recommendation",
      mainContent: `It is with great pleasure that I recommend ${name}, who worked with us as a ${post} in  ${department} at Renu Sharma Healthcare Education & Foundation. During their tenure, ${name} exhibited exceptional proficiency and dedication in their role. Their willingness to take initiative and contribute meaningfully to projects made a significant impact on the team.`,
      closingContent: `${name} not only demonstrated strong technical abilities but also proved to be a team player with remarkable interpersonal skills. They managed to adapt swiftly to challenges and brought a high level of enthusiasm and professionalism to every task.`,
      finalMessage:
        `I am confident that ${name} will excel in their future endeavors, and I wholeheartedly recommend them for any position they choose to pursue. They are truly an asset to any team.`,
      congratsMessage: "Best wishes for your future endeavors.",
      folderPath: "lorCertificate",
    },
  };

  return templates[certificateName.toLowerCase()] || templates.lor;
};

const generateCertificate = async (name, email, post, certificateName,department) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });
    const buffers = [];
    const template = getCertificateContent(certificateName, name, post,department);
    const certificatePath = `${template.folderPath}/${name}_certificate.pdf`;
    const writeStream = fs.createWriteStream(certificatePath);

    // Pipe the PDF document to buffers array
    doc.on("data", buffers.push.bind(buffers));

    // Pipe the PDF document to write stream to save locally
    doc.pipe(writeStream);

    // Add header with a blue background and logo
    const logoPath = "images/logo-image.png";
    doc.rect(0, 0, doc.page.width, 150).fill("#003366"); // Blue background
    doc.image(logoPath, 50, 30, { width: 100, height: 100 }); // Adjust size and position as needed

    // Address section in white text
    doc
      .fillColor("white")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Renu Sharma Healthcare Education & Foundation", 200, 30, {
        align: "left",
      });
    doc.moveDown();
    doc
      .fontSize(10)
      .font("Helvetica")
      .text("VPO Baspadmka, Teh Pataudi", 200, 50, { align: "left" })
      .text("Dist Gurugram (HR)", 200, 65, { align: "left" })
      .text("Pin: 122503", 200, 80, { align: "left" });

    // Add a horizontal line to separate header
    doc.moveTo(50, 140).lineTo(doc.page.width - 50, 140).stroke();

    // Right-aligned date with a line above
    doc
      .moveTo(400, 160)
      .lineTo(doc.page.width - 50, 160)
      .stroke();
    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Date: ${new Date().toLocaleDateString()}`, 400, 170, {
        align: "right",
      });

    // Add margins for the content block
    const contentMargin = 100;

    // Subject centered with equal margins from left and right
    doc.moveDown(2);
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Subject: ${template.subject}`, contentMargin, 220, {
        align: "center",
        width: doc.page.width - 2 * contentMargin,
      });

    // Salutation and main content starting centered with equal margins
    doc.moveDown(2);
    doc
      .font("Helvetica")
      .fontSize(12)
      .text(`Dear ${name},`, contentMargin, doc.y + 20, {
        align: "left",
        width: doc.page.width - 2 * contentMargin,
      })
      .moveDown();
    doc.text(template.mainContent, contentMargin, doc.y, {
      align: "justify",
      width: doc.page.width - 2 * contentMargin,
      lineGap: 4,
    });
    doc.moveDown();
    doc.text(template.closingContent, contentMargin, doc.y, {
      align: "justify",
      width: doc.page.width - 2 * contentMargin,
      lineGap: 4,
    });
    doc.moveDown();
    doc.text(template.finalMessage, contentMargin, doc.y, {
      align: "justify",
      width: doc.page.width - 2 * contentMargin,
      lineGap: 4,
    });
    doc.moveDown();
    doc.text(template.congratsMessage, contentMargin, doc.y, {
      align: "left",
      width: doc.page.width - 2 * contentMargin,
    });
    doc.moveDown();

    // Signature block (centered with equal margins)
    doc.moveDown(3);
    doc.font("Helvetica-Bold").text("Sincerely,", contentMargin, doc.y, {
      align: "left",
      width: doc.page.width - 2 * contentMargin,
    });
    doc.text("Renu Sharma", contentMargin, doc.y, {
      align: "left",
      width: doc.page.width - 2 * contentMargin,
    });
    doc.text("Founder & Director", contentMargin, doc.y, {
      align: "left",
      width: doc.page.width - 2 * contentMargin,
    });
    doc.text("Renu Sharma Healthcare Education & Foundation", contentMargin, doc.y, {
      align: "left",
      width: doc.page.width - 2 * contentMargin,
    });

    // Bottom blue border
    doc
      .lineWidth(25)
      .strokeColor("#003366")
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
        resolve({ path: certificatePath, buffer: Buffer.concat(buffers) });
      } catch (error) {
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
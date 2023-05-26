function generateMarkdownScript (input) {
    const sections = input.split('\n\n').map(section => section.trim());
  
    let markdown = `## ${sections[0]}\n\n`;
  
    sections.slice(1).forEach((section) => {
      markdown += `- ${section}\n\n`;
    });
  
    return markdown;
};
  
module.exports = {
    generateMarkdownScript
};
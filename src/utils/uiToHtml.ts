// src/utils/uiToHtml.js
export function convertUiToHtml(uiHierarchy) {
    function dfs(node) {
      let html = `<${node.type}`;
      
      // Add attributes
      for (const [key, value] of Object.entries(node.attributes)) {
        html += ` ${key}="${value}"`;
      }
      
      html += '>';
      
      // Add text content if any
      if (node.text) {
        html += node.text;
      }
      
      // Recursively process child nodes
      if (node.children) {
        for (const child of node.children) {
          html += dfs(child);
        }
      }
      
      html += `</${node.type}>`;
      return html;
    }
    
    return dfs(uiHierarchy);
  }
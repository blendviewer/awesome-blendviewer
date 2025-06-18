export interface Resource {
  name: string;
  description: string;
  link: string;
  date: string;
  category: string;
}

export function parseMarkdownToResources(markdown: string): Resource[] {
  const resources: Resource[] = [];
  const lines = markdown.split('\n');
  
  let currentCategory = '';
  let inTable = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 检测分类标题
    if (line.startsWith('## ') && !line.includes('Star History') && !line.includes('Contributors')) {
      currentCategory = line.replace('## ', '').trim();
      inTable = false;
      continue;
    }
    
    // 检测表格头部
    if (line.startsWith('| Name ') || line.startsWith('|---')) {
      inTable = true;
      continue;
    }
    
    // 解析表格行
    if (inTable && line.startsWith('|') && !line.startsWith('|---') && !line.startsWith('| Name')) {
      const columns = line.split('|').map(col => col.trim()).filter(col => col !== '');
      
      if (columns.length >= 3) {
        const name = columns[0];
        const description = columns[1];
        const linkMatch = columns[2].match(/\[Link\]\(([^)]+)\)/);
        const link = linkMatch ? linkMatch[1] : '';
        const date = columns[3] || '';
        
        if (name && description && link) {
          resources.push({
            name,
            description,
            link,
            date,
            category: currentCategory
          });
        }
      }
    }
    
    // 重置表格状态如果遇到空行
    if (line === '' && inTable) {
      inTable = false;
    }
  }
  
  return resources;
}

export function getCategoryStats(resources: Resource[]) {
  const stats: Record<string, number> = {};
  
  resources.forEach(resource => {
    stats[resource.category] = (stats[resource.category] || 0) + 1;
  });
  
  return stats;
}

export function getDateStats(resources: Resource[]) {
  const yearStats: Record<string, number> = {};
  
  resources.forEach(resource => {
    if (resource.date) {
      const year = resource.date.split('-')[0];
      if (year && year.length === 4) {
        yearStats[year] = (yearStats[year] || 0) + 1;
      }
    }
  });
  
  return yearStats;
} 
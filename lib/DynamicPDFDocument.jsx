/* eslint-disable react/prop-types */
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// ============================================================================
// DYNAMIC STYLES GENERATOR
// ============================================================================

const createStyles = (config) => {
  const colors = config.colors || {
    primary: '#1e40af',
    primaryDark: '#1e293b',
    secondary: '#2563eb',
    success: '#10b981',
    warning: '#d97706',
    error: '#dc2626',
  };

  return StyleSheet.create({
    page: {
      paddingTop: 50,
      paddingLeft: 50,
      paddingRight: 50,
      paddingBottom: 70,
      fontFamily: 'Helvetica',
      fontSize: 10,
      backgroundColor: '#ffffff',
      lineHeight: 1.5,
      position: 'relative',
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: colors.secondary,
      paddingBottom: 20,
    },
    title: {
      fontSize: 24,
      color: colors.primary,
      marginBottom: 8,
      fontFamily: 'Helvetica-Bold',
    },
    section: {
      marginTop: 8,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 18,
      color: colors.primary,
      marginBottom: 12,
      fontFamily: 'Helvetica-Bold',
      borderBottomWidth: 1,
      borderBottomColor: '#cbd5e1',
      paddingBottom: 8,
    },
    subsectionTitle: {
      fontSize: 13,
      color: '#334155',
      marginBottom: 4,
      marginTop: 4,
      fontFamily: 'Helvetica-Bold',
    },
    bodyText: {
      fontSize: 10,
      color: '#334155',
      lineHeight: 1.5,
    },
    helpText: {
      fontSize: 9,
      color: '#64748b',
      fontStyle: 'italic',
      marginTop: 4,
      lineHeight: 1.4,
    },
    codeText: {
      fontFamily: 'Courier',
      fontSize: 9,
      color: '#334155',
      backgroundColor: '#f8fafc',
      padding: 2,
    },
    infoBox: {
      backgroundColor: '#f8fafc',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderRadius: 6,
      padding: 12,
      marginBottom: 8,
    },
    infoBoxBlue: {
      backgroundColor: '#eff6ff',
      borderColor: '#93c5fd',
    },
    infoBoxGreen: {
      backgroundColor: '#f0fdf4',
      borderColor: '#86efac',
    },
    infoBoxRed: {
      backgroundColor: '#fef2f2',
      borderColor: '#fca5a5',
    },
    infoBoxYellow: {
      backgroundColor: '#fef3c7',
      borderColor: '#fbbf24',
    },
    infoRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 10,
      color: '#334155',
      fontFamily: 'Helvetica-Bold',
      width: 100,
    },
    infoValue: {
      fontSize: 10,
      color: colors.primaryDark,
      fontFamily: 'Courier',
      flex: 1,
    },
    list: {
      marginVertical: 8,
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: 4,
      alignItems: 'flex-start',
    },
    bulletPoint: {
      width: 15,
      fontSize: 10,
      color: colors.primary,
      textAlign: 'center',
    },
    listContent: {
      fontSize: 10,
      color: '#334155',
      flex: 1,
      lineHeight: 1.5,
      paddingLeft: 4,
    },
    securityBadge: {
      backgroundColor: '#fef3c7',
      borderWidth: 1,
      borderColor: '#fbbf24',
      borderRadius: 6,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    securityText: {
      fontSize: 9,
      color: '#78350f',
      flex: 1,
    },
    endpointCard: {
      borderWidth: 2,
      borderColor: '#e2e8f0',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#ffffff',
      marginBottom: 8,
    },
    endpointHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
    },
    methodBadge: {
      backgroundColor: colors.success,
      color: '#ffffff',
      fontFamily: 'Helvetica-Bold',
      fontSize: 11,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 4,
      marginRight: 12,
    },
    endpointUrl: {
      fontFamily: 'Courier',
      color: colors.primaryDark,
      fontSize: 11,
      flex: 1,
    },
    table: {
      width: '100%',
      marginTop: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderRadius: 6,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      minHeight: 28,
      width: '100%',
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
    },
    tableCell: {
      padding: 8,
      fontSize: 9,
      flex: 1,
      borderRightWidth: 1,
      borderRightColor: '#e2e8f0',
      color: '#334155',
      justifyContent: 'center',
      minHeight: 28,
    },
    tableCellHeader: {
      fontFamily: 'Helvetica-Bold',
      color: colors.primaryDark,
    },
    tableCellLast: {
      borderRightWidth: 0,
    },
    responseBox: {
      backgroundColor: '#f0fdf4',
      borderWidth: 1,
      borderColor: '#86efac',
      borderRadius: 6,
      padding: 12,
      marginTop: 8,
    },
    responseCode: {
      fontFamily: 'Helvetica-Bold',
      color: '#16a34a',
      fontSize: 10,
    },
    responseDesc: {
      fontSize: 9,
      color: '#166534',
      marginTop: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 50,
      right: 50,
      height: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      paddingTop: 8,
    },
    footerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    footerText: {
      color: '#64748b',
      fontSize: 8,
    },
    footerDivider: {
      color: '#cbd5e1',
      fontSize: 8,
      marginHorizontal: 8,
    },
    pageNumber: {
      color: '#64748b',
      fontSize: 8,
      fontFamily: 'Helvetica-Bold',
    },
    practiceItem: {
      marginBottom: 12,
    },
  });
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const replaceVariables = (text, config) => {
  if (!text) return text;
  
  return text.replace(/\{([^}]+)\}/g, (match, path) => {
    const keys = path.split('.');
    let value = config;
    
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return match;
    }
    
    return value;
  });
};

// ============================================================================
// RENDER COMPONENTS
// ============================================================================

const BulletList = ({ items, styles }) => (
  <View style={styles.list}>
    {items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.listContent}>
          {typeof item === 'string' ? item : item.text}
        </Text>
      </View>
    ))}
  </View>
);

const NumberedList = ({ items, styles }) => (
  <View style={styles.list}>
    {items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={[styles.bulletPoint, { width: 20 }]}>{index + 1}.</Text>
        <Text style={styles.listContent}>
          {typeof item === 'string' ? item : item.text}
        </Text>
      </View>
    ))}
  </View>
);

const InfoBox = ({ data, styles, config }) => {
  const variantStyles = {
    default: {},
    blue: styles.infoBoxBlue,
    green: styles.infoBoxGreen,
    red: styles.infoBoxRed,
    yellow: styles.infoBoxYellow,
  };

  return (
    <View
      style={[styles.infoBox, variantStyles[data.variant || 'default']]}
      wrap={false}
      minPresenceAhead={100}
    >
      {data.title && (
        <Text style={[styles.subsectionTitle, { marginTop: 0 }]}>
          {replaceVariables(data.title, config)}
        </Text>
      )}
      {data.content && (
        <Text style={styles.bodyText}>
          {replaceVariables(data.content, config)}
        </Text>
      )}
      {data.items &&
        data.items.map((item, idx) => (
          <View key={idx} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}:</Text>
            <Text style={styles.infoValue}>
              {replaceVariables(item.value, config)}
            </Text>
          </View>
        ))}
      {data.list && (
        data.list.type === 'bullet' ? (
          <BulletList items={data.list.items} styles={styles} />
        ) : (
          <NumberedList items={data.list.items} styles={styles} />
        )
      )}
    </View>
  );
};

const Table = ({ data, styles }) => {
  const { headers, rows, columnWidths } = data;

  return (
    <View style={styles.table} wrap={false} minPresenceAhead={150}>
      <View
        style={[styles.tableRow, styles.tableHeader]}
        wrap={false}
        minPresenceAhead={35}
      >
        {headers.map((header, index) => (
          <Text
            key={index}
            style={[
              styles.tableCell,
              styles.tableCellHeader,
              { flex: columnWidths[index] },
              index === headers.length - 1 && styles.tableCellLast,
            ]}
            wrap={false}
          >
            {header}
          </Text>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={styles.tableRow}
          wrap={false}
          minPresenceAhead={35}
        >
          {row.map((cell, cellIndex) => (
            <Text
              key={cellIndex}
              style={[
                styles.tableCell,
                { flex: columnWidths[cellIndex] },
                cellIndex === row.length - 1 && styles.tableCellLast,
              ]}
              wrap={false}
            >
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const Section = ({ section, styles, config, estimatedPercentage }) => {
  // Use percentage-based minPresenceAhead calculation
  const minPresence = Math.min(estimatedPercentage * 8, 200); // Convert % to pixels (rough estimate)
  
  return (
    <View 
      style={styles.section} 
      wrap={false} 
      minPresenceAhead={minPresence}
    >
      {section.title && (
        <Text style={styles.sectionTitle} wrap={false}>
          {replaceVariables(section.title, config)}
        </Text>
      )}
      {section.content && (
        <Text style={styles.bodyText}>
          {replaceVariables(section.content, config)}
        </Text>
      )}
      {section.helpText && (
        <Text style={styles.helpText}>
          {replaceVariables(section.helpText, config)}
        </Text>
      )}
      {section.list && (
        section.list.type === 'bullet' ? (
          <BulletList items={section.list.items} styles={styles} />
        ) : (
          <NumberedList items={section.list.items} styles={styles} />
        )
      )}
      {section.table && <Table data={section.table} styles={styles} />}
      {section.codeBlock && (
        <View style={styles.infoBox} wrap={false} minPresenceAhead={100}>
          <Text style={styles.codeText}>
            {replaceVariables(section.codeBlock.code, config)}
          </Text>
        </View>
      )}
      {section.responseBox && (
        <View style={styles.responseBox} wrap={false} minPresenceAhead={60}>
          <Text style={styles.responseCode}>{section.responseBox.code}</Text>
          <Text style={styles.responseDesc}>
            {section.responseBox.description}
          </Text>
        </View>
      )}
      {section.endpoints &&
        section.endpoints.map((endpoint, idx) => (
          <View key={idx} wrap={false} minPresenceAhead={120}>
            <View
              style={styles.endpointCard}
              wrap={false}
              minPresenceAhead={80}
            >
              <View style={styles.endpointHeader} wrap={false}>
                <Text style={styles.methodBadge}>{endpoint.method}</Text>
                <Text style={styles.endpointUrl}>
                  {replaceVariables(endpoint.path, config)}
                </Text>
              </View>
              <Text style={styles.bodyText} wrap={false}>
                {endpoint.description}
              </Text>
            </View>
            
            {/* Render endpoint parameters if they exist */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <View style={styles.section} wrap={false} minPresenceAhead={100}>
                <Text style={styles.subsectionTitle}>Parameters</Text>
                <Table 
                  data={{
                    headers: ["Parameter", "Type", "Description"],
                    columnWidths: [0.25, 0.25, 0.5],
                    rows: endpoint.parameters.map(param => [
                      param.name,
                      param.type,
                      param.description
                    ])
                  }} 
                  styles={styles} 
                />
              </View>
            )}
          </View>
        ))}
      {section.practices &&
        section.practices.map((practice, idx) => (
          <View key={idx} style={styles.practiceItem} wrap={false}>
            <Text style={styles.bodyText}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                {practice.title}:
              </Text>{' '}
              {practice.content}
            </Text>
          </View>
        ))}
      {section.subsections &&
        section.subsections.map((subsection, idx) => {
          if (subsection.type === 'infoBox') {
            return <InfoBox key={idx} data={subsection} styles={styles} config={config} />;
          }
          if (subsection.type === 'securityBadge') {
            return (
              <View key={idx} style={styles.securityBadge} wrap={false}>
                <Text style={styles.securityText}>
                  {replaceVariables(subsection.text, config)}
                </Text>
              </View>
            );
          }
          if (subsection.type === 'section') {
            return (
              <View key={idx} wrap={false} minPresenceAhead={80}>
                {subsection.title && (
                  <Text style={styles.subsectionTitle} wrap={false}>{subsection.title}</Text>
                )}
                {subsection.helpText && (
                  <Text style={styles.helpText}>
                    {replaceVariables(subsection.helpText, config)}
                  </Text>
                )}
                {subsection.table && <Table data={subsection.table} styles={styles} />}
                {subsection.content && (
                  <Text style={styles.bodyText}>
                    {replaceVariables(subsection.content, config)}
                  </Text>
                )}
              </View>
            );
          }
          if (subsection.type === 'subsection') {
            return (
              <View key={idx} wrap={false} minPresenceAhead={60}>
                {subsection.title && (
                  <Text style={styles.subsectionTitle} wrap={false}>{subsection.title}</Text>
                )}
                {subsection.content?.type === 'codeBlock' && (
                  <View style={styles.infoBox}>
                    <Text style={styles.codeText}>
                      {replaceVariables(subsection.content.code, config)}
                    </Text>
                  </View>
                )}
              </View>
            );
          }
          return null;
        })}
    </View>
  );
};

const PageFooter = ({ config }) => {
  const styles = createStyles(config);
  
  return (
    <View style={styles.footer} fixed>
      <View style={styles.footerLeft}>
        <Text style={styles.footerText}>{config.metadata.title}</Text>
        <Text style={styles.footerDivider}>•</Text>
        <Text style={styles.footerText}>Version {config.metadata.version}</Text>
      </View>
      <Text
        render={({ pageNumber }) => `Page ${pageNumber}`}
        style={styles.pageNumber}
      />
    </View>
  );
};

// ============================================================================
// PERCENTAGE-BASED PAGE UTILIZATION SYSTEM
// ============================================================================

const calculateSectionPercentage = (section) => {
  let percentage = 0;
  
  // Section title: 2%
  if (section.title) {
    percentage += 2;
  }
  
  // Content text: 1% per estimated line (more conservative)
  if (section.content) {
    const lines = Math.ceil(section.content.length / 80);
    percentage += lines * 1;
  }
  
  // Help text: 1% per line
  if (section.helpText) {
    const lines = Math.ceil(section.helpText.length / 90);
    percentage += lines * 1;
  }
  
  // Endpoints: 5% per endpoint card (reduced from 8%)
  if (section.endpoints) {
    section.endpoints.forEach(endpoint => {
      percentage += 5; // Base endpoint card
      
      // Parameters table: 2% + 1% per row (reduced)
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        percentage += 2; // Table header
        percentage += endpoint.parameters.length * 1; // Each parameter row
      }
    });
  }
  
  // Tables in subsections: 2% header + 1% per row (reduced)
  if (section.subsections) {
    section.subsections.forEach(subsection => {
      if (subsection.title) percentage += 1.5; // Subsection title
      if (subsection.helpText) {
        const lines = Math.ceil(subsection.helpText.length / 90);
        percentage += lines * 1;
      }
      if (subsection.table) {
        percentage += 2; // Table header
        percentage += subsection.table.rows.length * 1; // Each row
      }
      if (subsection.content) {
        const lines = Math.ceil(subsection.content.length / 80);
        percentage += lines * 1;
      }
    });
  }
  
  // Practices: 1.5% per practice item
  if (section.practices) {
    percentage += section.practices.length * 1.5;
  }
  
  // Info boxes: 5% base + 0.5% per item (reduced)
  if (section.type === 'infoBox') {
    percentage += 5; // Base info box
    if (section.items) {
      percentage += section.items.length * 0.5;
    }
    if (section.list && section.list.items) {
      percentage += section.list.items.length * 0.5;
    }
  }
  
  // Header sections: 4%
  if (section.type === 'header') {
    percentage += 4;
  }
  
  return Math.max(percentage, 1); // Minimum 1% per section
};

// ============================================================================
// MAIN DOCUMENT COMPONENT
// ============================================================================

const DynamicPDFDocument = ({ config }) => {
  const styles = createStyles(config);
  
  // Optimize each page object separately while respecting page boundaries
  const optimizedPages = [];
  const maxPageUtilization = 90;
  
  config.pages.forEach((pageObj, pageObjIndex) => {
    let currentPageSections = [];
    let currentPagePercentage = 0;
    
    pageObj.sections.forEach((section, sectionIndex) => {
      const sectionPercentage = calculateSectionPercentage(section);
      
      // If this section alone exceeds max utilization, put it on its own page
      if (sectionPercentage > maxPageUtilization) {
        // Finish current page if it has content
        if (currentPageSections.length > 0) {
          optimizedPages.push({
            sections: [...currentPageSections],
            utilization: currentPagePercentage,
            originalPageId: pageObj.id
          });
          currentPageSections = [];
          currentPagePercentage = 0;
        }
        // Add the large section to its own page
        optimizedPages.push({
          sections: [section],
          utilization: sectionPercentage,
          originalPageId: pageObj.id
        });
        return;
      }
      
      // If adding this section would exceed max utilization, start new page
      if (currentPagePercentage + sectionPercentage > maxPageUtilization) {
        optimizedPages.push({
          sections: [...currentPageSections],
          utilization: currentPagePercentage,
          originalPageId: pageObj.id
        });
        currentPageSections = [section];
        currentPagePercentage = sectionPercentage;
      } else {
        // Add section to current page
        currentPageSections.push(section);
        currentPagePercentage += sectionPercentage;
      }
    });
    
    // Finish the current page object - force page break here
    if (currentPageSections.length > 0) {
      optimizedPages.push({
        sections: currentPageSections,
        utilization: currentPagePercentage,
        originalPageId: pageObj.id
      });
      currentPageSections = [];
      currentPagePercentage = 0;
    }
  });
  
  console.log("📊 Page-Controlled Optimization:");
  console.log(`Original page objects: ${config.pages.length}`);
  console.log(`Optimized PDF pages: ${optimizedPages.length}`);
  
  console.log("📄 Page Object Breakdown:");
  config.pages.forEach((pageObj, index) => {
    const pageObjPages = optimizedPages.filter(p => p.originalPageId === pageObj.id);
    console.log(`\n🔷 Page Object "${pageObj.id}": ${pageObj.sections.length} sections → ${pageObjPages.length} PDF pages`);
    
    pageObj.sections.forEach((section, sIndex) => {
      const percentage = calculateSectionPercentage(section);
      console.log(`    - "${section.title || section.type}" (${percentage.toFixed(1)}%)`);
    });
    
    pageObjPages.forEach((pdfPage, pIndex) => {
      console.log(`    📄 PDF Page ${optimizedPages.indexOf(pdfPage) + 1}: ${pdfPage.utilization.toFixed(1)}% utilization`);
    });
  });

  return (
    <Document
      title={config?.metadata?.title}
      author={config.metadata.author}
      subject={config.metadata.subject}
      keywords={config.metadata.keywords}
    >
      {optimizedPages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page} wrap>
          <PageFooter config={config} />

          {pageData.sections.map((section, sectionIndex) => {
            const sectionPercentage = calculateSectionPercentage(section);
            
            if (section.type === 'header') {
              return (
                <View key={sectionIndex} style={styles.header} wrap={false}>
                  <Text style={styles.title}>
                    {replaceVariables(section.title, config)}
                  </Text>
                </View>
              );
            }
            if (section.type === 'infoBox') {
              return (
                <InfoBox
                  key={sectionIndex}
                  data={section}
                  styles={styles}
                  config={config}
                />
              );
            }
            if (section.type === 'section') {
              return (
                <Section
                  key={sectionIndex}
                  section={section}
                  styles={styles}
                  config={config}
                  estimatedPercentage={sectionPercentage}
                />
              );
            }
            return null;
          })}
        </Page>
      ))}
    </Document>
  );
};

export default DynamicPDFDocument;

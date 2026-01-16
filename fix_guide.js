const fs = require('fs');

const filePath = 'c:\\Users\\thado\\.gemini\\antigravity\\scratch\\design-system-app\\mobile-app\\app\\guide-manual-v3.tsx';
try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Fix VisualEducationItem interface
    content = content.replace(
        /interface VisualEducationItem \{[^}]*explanation: string \| \{ buy: string; sell: string \} \| Array<\{ title: string; subtitle\?: string; content: string; proTip: string \}>;/s,
        (match) => match.replace('proTip: string', 'proTip?: string')
    );

    // 2. Fix MasterclassEducationModal props
    content = content.replace(
        /explanation: string \| \{ buy: string; sell: string \} \| Array<\{ title: string; subtitle\?: string; content: string; proTip: string \}>;/s,
        (match) => match.replace('proTip: string', 'proTip?: string')
    );

    // 3. Fix the render logic for Array(explanation)
    // We'll use a more flexible regex for the render block
    content = content.replace(
        /<View style=\{styles\.proTipContainer\}>.*?<Text style=\{styles\.proTipText\}>.*?PRO TIP:.*?\{section\.proTip\}.*?<\/Text>\s*<\/View>/gs,
        `{section.proTip ? (
                                                <View style={styles.proTipContainer}>
                                                    <View style={styles.proTipGlitch} />
                                                    <Text style={styles.proTipText}>
                                                        <Text style={{ fontWeight: 'bold', color: '#D4AF37' }}>PRO TIP:</Text> {section.proTip}
                                                    </Text>
                                                </View>
                                            ) : null}`
    );

    fs.writeFileSync(filePath, content);
    console.log('Successfully updated guide-manual-v3.tsx');
} catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
}

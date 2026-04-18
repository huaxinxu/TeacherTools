import re

filepath = r'src\lib\exploreData.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Character class for CJK chars and Chinese/fullwidth punctuation
CJK = r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]'
# Inner content for embedded quotes (CJK, punctuation, alphanumeric, space)
INNER = r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\w ]+'

# Step 1: Remove stray " after corner bracket 」 when followed by content
# 」" at end of string value is CORRECT (」 then closing "), skip those
# 」" followed by CJK/Chinese content is WRONG (stray ")
before = content.count('"""')
content = re.sub(r'\u300d"(?=' + CJK + ')', '\u300d', content)
after = content.count('"""')
step1_fixes = before - after
print(f"Step 1 - Removed stray quotes after corner brackets")

# Step 2: Convert remaining embedded "word" to corner brackets
# Pattern: CJK char before ", content inside, " followed by CJK char
# Multiple passes to handle adjacent pairs on same line
total_step2 = 0
for i in range(5):
    new_content = re.sub(
        r'(?<=' + CJK + r')"(' + INNER + r')"(?=' + CJK + r')',
        '\u300c\\1\u300d',
        content
    )
    fixes = len(content) - len(new_content) + new_content.count('\u300c') - content.count('\u300c')
    if new_content == content:
        break
    content = new_content
    total_step2 += 1
    print(f"  Pass {i+1}: made replacements")

print(f"Step 2 - Converted embedded quotes to corner brackets ({total_step2} passes)")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("\nVerifying - checking for remaining problematic patterns...")

# Verify: look for lines that might still have issues
lines = content.split('\n')
issues = []
for i, line in enumerate(lines, 1):
    # Skip non-data lines
    if not line.strip().startswith('{ id:'):
        continue
    # Check for embedded " inside string values (rough check)
    # Find all string values and check for unescaped inner "
    in_string = False
    escape = False
    depth = 0
    for j, ch in enumerate(line):
        if escape:
            escape = False
            continue
        if ch == '\\':
            escape = True
            continue
        if ch == '"' and not in_string:
            in_string = True
            depth = 0
            continue
        if ch == '"' and in_string:
            in_string = False
            continue
    # If we end with in_string=True, there's an issue
    # Actually this simple parser won't work well for detecting issues.
    # Let's just check if the line is syntactically valid by counting quote pairs

# Alternative verification: check for 」" pattern still remaining
remaining = re.findall(r'\u300d"(?=' + CJK + ')', content)
if remaining:
    print(f"WARNING: {len(remaining)} stray quotes after corner brackets still remain!")
else:
    print("OK: No stray quotes after corner brackets")

# Check for embedded "word" patterns (CJK before ", CJK content, " followed by CJK)
remaining2 = re.findall(r'(?<=' + CJK + r')"' + INNER + r'"(?=' + CJK + r')', content)
if remaining2:
    print(f"WARNING: {len(remaining2)} embedded quote patterns still remain!")
    for r in remaining2[:5]:
        print(f"  Found: ...{r}...")
else:
    print("OK: No embedded double quotes in CJK content")

print("\nDone! Try running: npm run build")

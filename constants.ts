
import { Language, GameMode } from './types';

export const ACCENT_COLORS = [
  { name: 'Solar Amber', value: '#f59e0b' },
  { name: 'Cyber Blue', value: '#3b82f6' },
  { name: 'Electric Violet', value: '#8b5cf6' },
  { name: 'Plasma Green', value: '#10b981' },
  { name: 'Crimson Red', value: '#ef4444' },
  { name: 'Neutral Zinc', value: '#71717a' },
];

export const MODES = [
  { 
    id: GameMode.SPEED, 
    name: 'Speed Test', 
    desc: 'Measure your raw typing speed and accuracy under normal conditions.', 
    theme: '#f59e0b' 
  },
  { 
    id: GameMode.DEBUG, 
    name: 'Syntax Fixer', 
    desc: 'Quickly find and correct spelling and keyword errors in the code.', 
    theme: '#3b82f6' 
  },
  { 
    id: GameMode.SILENT_ERROR, 
    name: 'Blind Typing', 
    desc: 'Type without any error feedback. Mistakes are revealed at the very end.', 
    theme: '#71717a' 
  },
  { 
    id: GameMode.BUG_INJECTION, 
    name: 'Glitch Mode', 
    desc: 'Spelling errors appear while you type. Fix them instantly to continue.', 
    theme: '#ef4444' 
  },
  { 
    id: GameMode.CONTEXT_SWITCH, 
    name: 'Language Swap', 
    desc: 'The programming language changes every 20 seconds. Adapt fast!', 
    theme: '#8b5cf6' 
  },
  { 
    id: GameMode.MIRROR, 
    name: 'Mirror View', 
    desc: 'The code is flipped horizontally. Type what you see as it appears.', 
    theme: '#10b981' 
  },
  { 
    id: GameMode.DISTRACTION, 
    name: 'Focus Test', 
    desc: 'Type while fake notifications and popups try to distract you.', 
    theme: '#ef4444' 
  },
  { 
    id: GameMode.BOSS_FIGHT, 
    name: 'Ultimate Challenge', 
    desc: '120 seconds of pure chaos. Select your own 3-language gauntlet and face every threat.', 
    theme: '#dc2626' 
  }
];

export const LANGUAGES: Language[] = [
  { 
    id: 'ts', 
    name: 'TypeScript', 
    color: '#3178c6', 
    accent: '#3178c6', 
    snippet: `interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nasync function fetchUser(id: string): Promise<User> {\n  const res = await fetch(\`/api/v1/user/\${id}\`);\n  return await res.json();\n}`,
    buggySnippet: `interfaze User {\n  id: number;\n  name: strink;\n  email: strink;\n}\n\nasync function fetchUzer(id: string): Promize<User> {\n  const res = await fetch(\`/api/v1/user/\${id}\`);\n  return await res.jzon();\n}`
  },
  { 
    id: 'py', 
    name: 'Python', 
    color: '#3776ab', 
    accent: '#ffd343', 
    snippet: `import os\nfrom typing import List\n\ndef list_files(path: str) -> List[str]:\n    try:\n        return [f for f in os.listdir(path) if os.path.isfile(f)]\n    except Exception as e:\n        print(f"Error: {e}")\n        return []`,
    buggySnippet: `import oz\nfrm typing import List\n\ndf list_files(path: str) -> List[str]:\n    try:\n        return [f for f in oz.listdir(path) if oz.is_file(f)]\n    excpt Exception as e:\n        prnt(f"Error: {e}")\n        retrn []`
  },
  { 
    id: 'rs', 
    name: 'Rust', 
    color: '#dea584', 
    accent: '#dea584', 
    snippet: `use std::collections::HashMap;\n\npub fn count_chars(text: &str) -> HashMap<char, usize> {\n    let mut map = HashMap::new();\n    for c in text.chars() {\n        *map.entry(c).or_insert(0) += 1;\n    }\n    map\n}`,
    buggySnippet: `use std::collections::HazhMap;\n\npbu fn count_chars(text: &str) -> HazhMap<char, usize> {\n    let mut map = HazhMap::new();\n    for c in text.charz() {\n        *map.antry(c).or_insrt(0) += 1;\n    }\n    map\n}`
  },
  { 
    id: 'js', 
    name: 'JavaScript', 
    color: '#f7df1e', 
    accent: '#000000', 
    snippet: `const processBatch = async (items) => {\n  for (const item of items) {\n    await new Promise(r => setTimeout(r, 100));\n    console.log(\`Processed: \${item.id}\`);\n  }\n};`,
    buggySnippet: `const procesBatch = async (itms) => {\n  for (const item of itms) {\n    await new Promize(r => setTimeut(r, 100));\n    conzole.log(\`Procesed: \${item.id}\`);\n  }\n};`
  },
  { 
    id: 'cpp', 
    name: 'C++', 
    color: '#00599c', 
    accent: '#00599c', 
    snippet: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 4};\n    for (int n : nums) {\n        std::cout << n << " ";\n    }\n    return 0;\n}`,
    buggySnippet: `#inclue <iostream>\n#inclue <vector>\n\nint main() {\n    std::vecter<int> nums = {1, 2, 3, 4};\n    for (int n : numz) {\n        std::cout << n << " ";\n    }\n    retrn 0;\n}`
  },
  { 
    id: 'go', 
    name: 'Go', 
    color: '#00add8', 
    accent: '#00add8', 
    snippet: `package main\n\nimport "fmt"\n\nfunc main() {\n    msgs := []string{"hello", "world"}\n    for _, m := range msgs {\n        fmt.Println(m)\n    }\n}`,
    buggySnippet: `packge main\n\nimprt "fmt"\n\nfunc main() {\n    msgs := []string{"hello", "world"}\n    for _, m := rnge msgs {\n        fmt.Println(m)\n    }\n}`
  },
  { 
    id: 'java', 
    name: 'Java', 
    color: '#007396', 
    accent: '#007396', 
    snippet: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Execution Started");\n        var list = java.util.List.of(1, 2, 3);\n        list.forEach(System.out::println);\n    }\n}`,
    buggySnippet: `pbuclic class Main {\n    pbuclic static void main(String[] args) {\n        System.out.println("Execution Startd");\n        var list = java.util.Lzt.of(1, 2, 3);\n        list.forEch(System.out::println);\n    }\n}`
  },
  {
    id: 'rb',
    name: 'Ruby',
    color: '#CC342D',
    accent: '#CC342D',
    snippet: `class Processor\n  def self.execute(tasks)\n    tasks.each do |task|\n      puts "Running: #{task.name}"\n      task.perform!\n    end\n  end\nend`,
    buggySnippet: `clasz Processor\n  def self.axecute(tasks)\n    tasks.each do |task|\n      puts "Running: #{task.nume}"\n      task.purform!\n    end\n  end\nend`
  },
  {
    id: 'swift',
    name: 'Swift',
    color: '#F05138',
    accent: '#F05138',
    snippet: `struct NetworkManager {\n  func fetchData() async throws -> Data {\n    let url = URL(string: "https://api.io")!\n    let (data, _) = try await URLSession.shared.data(from: url)\n    return data\n  }\n}`,
    buggySnippet: `struct NetwerkManager {\n  func fetchData() async throas -> Data {\n    let url = URL(string: "https://api.io")!\n    let (data, _) = try await URLSezsion.shared.data(from: url)\n    return data\n  }\n}`
  },
  {
    id: 'php',
    name: 'PHP',
    color: '#777BB4',
    accent: '#777BB4',
    snippet: `<?php\nnamespace App\\Controllers;\n\nclass ApiController extends Base {\n    public function index($request) {\n        return response()->json([\n            'status' => 'success',\n            'data' => []\n        ]);\n    }\n}`,
    buggySnippet: `<?php\nnamespace App\\Controllrs;\n\nclass ApiControllr extends Base {\n    pubic function index($reqest) {\n        return response()->jzon([\n            'status' => 'sucess',\n            'data' => []\n        ]);\n    }\n}`
  },
  {
    id: 'cs',
    name: 'C#',
    color: '#178600',
    accent: '#178600',
    snippet: `public class Service<T> where T : class {\n    private readonly List<T> _items = new();\n    public void Register(T item) {\n        if (item == null) throw new ArgumentNullException();\n        _items.Add(item);\n    }\n}`,
    buggySnippet: `public clasz Service<T> where T : clasz {\n    private readonly Lizt<T> _itms = new();\n    public void Regizter(T item) {\n        if (item == null) throw new ArgumntNullException();\n        _itms.Add(item);\n    }\n}`
  },
  {
    id: 'kt',
    name: 'Kotlin',
    color: '#7F52FF',
    accent: '#7F52FF',
    snippet: `data class Result(val id: String, val score: Int)\n\nfun calculateTotal(results: List<Result>): Int {\n    return results.filter { it.score > 0 }\n                  .sumOf { it.score }\n}`,
    buggySnippet: `data clasz Result(val id: Strink, val score: Int)\n\nfun calculateTotal(rezults: List<Result>): Int {\n    return rezults.filtr { it.score > 0 }\n                  .sumOf { it.score }\n}`
  },
  {
    id: 'sql',
    name: 'SQL',
    color: '#336791',
    accent: '#336791',
    snippet: `SELECT u.name, COUNT(o.id) as total_orders\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.status = 'completed'\nGROUP BY u.id\nHAVING total_orders > 5;`,
    buggySnippet: `SELECT u.nume, COUNT(o.id) az total_ordrs\nFROM uzers u\nJOIN ordrs o ON u.id = o.uzer_id\nWHERE o.stutus = 'complated'\nGROUP BY u.id\nHAVING total_ordrs > 5;`
  },
  {
    id: 'dart',
    name: 'Dart',
    color: '#0175C2',
    accent: '#0175C2',
    snippet: `class Point {\n  final double x, y;\n  Point(this.x, this.y);\n\n  double distanceTo(Point other) {\n    return sqrt(pow(x - other.x, 2) + pow(y - other.y, 2));\n  }\n}`,
    buggySnippet: `clasz Point {\n  final duble x, y;\n  Point(this.x, this.y);\n\n  duble diztanceTo(Point othr) {\n    return sqrt(pow(x - othr.x, 2) + pow(y - othr.y, 2));\n  }\n}`
  },
  {
    id: 'sh',
    name: 'Shell',
    color: '#4EAA25',
    accent: '#4EAA25',
    snippet: `#!/bin/bash\nset -e\n\nfor file in *.log; do\n    echo "Processing $file..."\n    grep "ERROR" "$file" > "errors_$file"\ndone\n\necho "Extraction complete."`,
    buggySnippet: `#!/bin/bazh\nset -e\n\nfor file in *.log; do\n    ecko "Procesing $file..."\n    grep "ERR0R" "$file" > "errors_$file"\ndone\n\necko "Extraktion complete."`
  }
];

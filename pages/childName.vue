s
<template>
    <div class="flex flex-col h-screen">
        <header class="border-b border-indigo-600 px-4 py-2">
            <h1 class="text-2xl font-bold text-[#4f46e5] text-center">宝宝姓名生成器</h1>
        </header>
        
        <div class="border-b  px-4 py-2">
            <!-- <span class="text-sm text-[#4f46e5] cursor-pointer pr-4">@下载模板</span> -->
            <!-- File Upload Componenet -->
            <span class="text-sm text-[#4f46e5] cursor-pointer pr-4" @click="importLocalFile">@Excel导入</span>
            <input v-show="false"
                ref="fileRef"
                class="text-sm text-[#4f46e5 cursor-pointer pr-4]"
                accept=".xls,.xlsx"
                type="file"
                @change="importFileChange($event)">
            <span class="text-sm text-[#4f46e5] cursor-pointer pr-4" @click="reset">>重置</span>
        </div>
        <main class="flex flex-1">
            <!-- Left Area -->
            <div class="flex flex-col flex-1 border-r pt-2 p-4">
                <!-- Left Bottom -->
                <div class="flex flex-col">
                    <header class="flex items-center justify-between">
                        <h2 class="text-2xl text-[#4f46e5] py-2">规则({{ rules.length }})</h2>
                        <div>
                            <!-- <span class="text-sm text-[#4f46e5] cursor-pointer pr-4">@导出</span> -->
                        </div>
                    </header>
                    <div class="flex-1 bg-slate-100 p-2 rounded-md">
                        <ul class="flex flex-row flex-wrap">
                            <li class="w-1/3"
                                v-for="(ruleWrapper, idxWrapper) in rules" 
                                :key="idxWrapper">
                                <span v-for="(rule, idx) in ruleWrapper" :key="idx">
                                    ({{ rule.type }}, {{ rule.num }})
                                </span>
                                <span>, </span>
                            </li>
                            <li v-if="rules.length === 0">暂无数据</li>
                        </ul>
                    </div>
                </div>
                <!-- Left Top -->
                <div class="flex flex-col flex-1">
                    <header class="flex items-center justify-between">
                        <h2 class="text-2xl text-[#4f46e5] py-2">汉字({{ words.length }})</h2>
                        <div>
                            <!-- <span class="text-sm text-[#4f46e5] cursor-pointer pr-4">@导出</span> -->
                        </div>
                    </header>
                    <div class="flex-1 bg-slate-100 p-2 rounded-md">
                        <ul class="flex flex-row flex-wrap">
                            <li class="w-1/5"
                                v-for="word in words"
                                :key="word.word"
                                >{{ word.word }}({{ word.type }}, {{ word.num }})，
                            </li>
                            <li v-if="words.length === 0">暂无数据</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Right Area -->
            <div class="flex flex-col flex-1 pt-2 p-4">
                <header class="flex items-center justify-between">
                    <h2 class="text-2xl text-[#4f46e5] py-2">结果({{ results.length }})</h2>
                    <div>
                        <span v-if="results.length" class="text-sm text-[#4f46e5] cursor-pointer pr-4"
                            @click="copyResults">#复制</span>
                        <span v-if="results.length" class="text-sm text-[#4f46e5] cursor-pointer pr-4">#导出</span>
                    </div>
                </header>
                <div class="flex-1 bg-slate-100 p-2 rounded-md">
                    <ul class="flex flex-row flex-wrap">
                        <template v-if="notEmptyArray(results)">
                            <li class="w-1/3"
                            v-for="(words, idx) in results"
                            :key="idx">{{ words2name(words, idx) }}</li>
                        </template>
                        <li v-else>暂无数据</li>
                        <!-- <li>姚顺海</li>
                        <li>姚顺钟</li>
                        <li>姚顺基</li>
                        <li>姚海顺</li>
                        <li>姚钟顺</li>
                        <li>姚基顺</li> -->
                    </ul>
                </div>
            </div>
            
        </main>
        
    </div>
</template>

<script setup lang="ts">
import ExcelJS from 'exceljs';

enum WORD_TYPE {
    GOLD = '金',
    WOOD = '木',
    WATER = '水',
    FIRE = '火',
    EARTH = '土',
    RANDOM = '随机'
};
// const words = [];
interface WORD_ITEM {
    word: string
    type: WORD_TYPE,
    num: number
}

let words = ref([    // 12画金：创，钦，善，竣，顺，诏，喆，舜，盛，尊，钧，然
//  { word: '创', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '钦', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '善', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '竣', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '顺', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '诏', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '喆', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '舜', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '盛', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '尊', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '钧', type: WORD_TYPE.GOLD, num: 12 },
//  { word: '然', type: WORD_TYPE.GOLD, num: 12 },
//   { word: '钟', type: WORD_TYPE.GOLD, num: 12 },
//   { word: '钞', type: WORD_TYPE.GOLD, num: 12 },
//   { word: '钦', type: WORD_TYPE.GOLD, num: 12 },
//   { word: '钧', type: WORD_TYPE.GOLD, num: 12 },
//   { word: '钫', type: WORD_TYPE.GOLD, num: 12 },
//   { word: '钬', type: WORD_TYPE.GOLD, num: 12 },
//   { word: '钪', type: WORD_TYPE.GOLD, num: 12 },
//  // 12画土：翔，壹，堡，岚，越
//  { word: '翔', type: WORD_TYPE.EARTH, num: 12},
//  { word: '壹', type: WORD_TYPE.EARTH, num: 12},
//  { word: '堡', type: WORD_TYPE.EARTH, num: 12},
//  { word: '岚', type: WORD_TYPE.EARTH, num: 12},
//  { word: '越', type: WORD_TYPE.EARTH, num: 12},
//  // 12画水：博，富，喜，渊，贺
//   { word: '博', type: WORD_TYPE.WATER, num: 12},
//   { word: '富', type: WORD_TYPE.WATER, num: 12},
//   { word: '喜', type: WORD_TYPE.WATER, num: 12},
//   { word: '渊', type: WORD_TYPE.WATER, num: 12},
//   { word: '贺', type: WORD_TYPE.WATER, num: 12},
//  // 12画火：智，登
//   { word: '智', type: WORD_TYPE.FIRE, num: 12},
//   { word: '登', type: WORD_TYPE.FIRE, num: 12},
//  // 11画金：晨，绍，祥，悦，崇
//   { word: '晨', type: WORD_TYPE.GOLD, num: 11},
//   { word: '绍', type: WORD_TYPE.GOLD, num: 11},
//   { word: '祥', type: WORD_TYPE.GOLD, num: 11},
//   { word: '悦', type: WORD_TYPE.GOLD, num: 11},
//   { word: '崇', type: WORD_TYPE.GOLD, num: 11},
//   // 11画土：堃，崎，域，基，堂，寅，伟，唯，悠，峥，翌
//   { word: '堃', type: WORD_TYPE.EARTH, num: 11},
//   { word: '崎', type: WORD_TYPE.EARTH, num: 11},
//   { word: '域', type: WORD_TYPE.EARTH, num: 11},
//   { word: '基', type: WORD_TYPE.EARTH, num: 11},
//   { word: '堂', type: WORD_TYPE.EARTH, num: 11},
//   { word: '寅', type: WORD_TYPE.EARTH, num: 11},
//   { word: '伟', type: WORD_TYPE.EARTH, num: 11},
//   { word: '唯', type: WORD_TYPE.EARTH, num: 11},
//   { word: '悠', type: WORD_TYPE.EARTH, num: 11},
//   { word: '峥', type: WORD_TYPE.EARTH, num: 11},
//   { word: '翌', type: WORD_TYPE.EARTH, num: 11},
//  // 11画水：海，浩，珩，斌
//    { word: '海', type: WORD_TYPE.WATER, num: 11},
//    { word: '浩', type: WORD_TYPE.WATER, num: 11},
//    { word: '珩', type: WORD_TYPE.WATER, num: 11},
//    { word: '斌', type: WORD_TYPE.WATER, num: 11},
//  // 11画火：翎，晟，晞，烯，烽
//     { word: '翎', type: WORD_TYPE.FIRE, num: 11},
//     { word: '晟', type: WORD_TYPE.FIRE, num: 11},
//     { word: '晞', type: WORD_TYPE.FIRE, num: 11},
//     { word: '烯', type: WORD_TYPE.FIRE, num: 11},
//     { word: '烽', type: WORD_TYPE.FIRE, num: 11},
]);

interface RULE_ITEM {
    type: WORD_TYPE,
    num: number
}
let rules = ref([
    // 随便12 + 11金
    // [{ type: WORD_TYPE.RANDOM, num: 12 }, { type: WORD_TYPE.GOLD, num: 11 }],
    // // 随便12 + 11土
    // [{ type: WORD_TYPE.RANDOM, num: 12 }, { type: WORD_TYPE.WOOD, num: 11 }],
    // // 12金 + 随便11
    // [{ type: WORD_TYPE.GOLD, num: 12 }, { type: WORD_TYPE.RANDOM, num: 11 }],
    // // 12土 + 随便11
    // [{ type: WORD_TYPE.WOOD, num: 12 }, { type: WORD_TYPE.RANDOM, num: 11 }],
    // // 12土 + 11金
    // [{ type: WORD_TYPE.WOOD, num: 12 }, { type: WORD_TYPE.GOLD, num: 11 }],
    // // 12金 + 11土
    // [{ type: WORD_TYPE.GOLD, num: 12 }, { type: WORD_TYPE.WOOD, num: 11 }],
]);


let results = ref([[]] as WORD_ITEM[][]);
async function copyResults() {
    const str = results.value
        .map((result: WORD_ITEM[], idx: number) => words2name(result, idx))
        .join('\n');
    await navigator.clipboard.writeText(str);
}
function removeRepeatResults(values: WORD_ITEM[][]): WORD_ITEM[][] {
    const ret: WORD_ITEM[][] = [];
    const retCollector = new Set<string>()

    values.forEach(value => {
        const k = value.map(o => o.word).join('');
        if (!retCollector.has(k)) {
            retCollector.add(k);
            ret.push(value);
        }
    })

    return ret;
}

class NameGenerator {
    words: WORD_ITEM[] = [];
    rules: RULE_ITEM[][] = [];
    wordsMap: Record<string, WORD_ITEM[]> = {};
    rulesMap: Record<string, RULE_ITEM[]> = {};
    allNameList: WORD_ITEM[][] = [];

    private wordsList2map<T>() {
        this.words.forEach(word => {
            const key = `${word.type}-${word.num}`;

            if (!this.wordsMap[key]) {
                this.wordsMap[key] = [];
            }
            this.wordsMap[key].push(word);
        })
    }

    private findWordsByRule(rule: RULE_ITEM): WORD_ITEM[] {
        if (rule.type === WORD_TYPE.RANDOM) {
            return Array.prototype.concat(
                this.wordsMap[`${WORD_TYPE.GOLD}-${rule.num}`] || [],
                this.wordsMap[`${WORD_TYPE.GOLD}-${rule.num}`] || [],
                this.wordsMap[`${WORD_TYPE.GOLD}-${rule.num}`] || [],
                this.wordsMap[`${WORD_TYPE.GOLD}-${rule.num}`] || [],
                this.wordsMap[`${WORD_TYPE.GOLD}-${rule.num}`] || [],
            );
        } else {
            return this.wordsMap[`${rule?.type}-${rule.num}`] || [];
        }
    }

    generateName(words: WORD_ITEM[], rules: RULE_ITEM[][]) {
        console.log('call generateName, ', words, rules)
        if (!notEmptyArray(words) || !notEmptyArray(rules)) return ''
        this.words = words;
        this.rules = rules;
        this.wordsList2map();

        const dfs = (prefixWords: WORD_ITEM[][], words: WORD_ITEM[]): WORD_ITEM[][] => {
            if (!notEmptyArray(words) && !notEmptyArray(prefixWords)) return [];
            else if (!notEmptyArray(words)) return prefixWords;
            else if (!notEmptyArray(prefixWords)) return words.map(w => [w]);
            
            let nameList: WORD_ITEM[][] = [];
            for (const pw of prefixWords) {
                for (const word of words) {
                    nameList.push([...pw, word]);
                }
            }

            return nameList;
        };

        let allNameList: WORD_ITEM[][] = [];
        for (const ruleWrapper of rules) {
            let nameList: WORD_ITEM[][] = [];
            for (const rule of ruleWrapper) {
                const wordList = this.findWordsByRule(rule);

                nameList = dfs(nameList, wordList);
            }

            allNameList = allNameList.concat(nameList)
        }

        allNameList = removeRepeatResults(allNameList);
        this.allNameList = allNameList;
        console.log('finish generateName, ', allNameList)
        return allNameList;
    }
}

const xql = new NameGenerator();
results.value = xql.generateName(words.value, rules.value);


// filters
function words2name(words: WORD_ITEM[], idx: number) {
    if (!(notEmptyArray(words))) return '--';
    
    const code = `00${idx + 1}`.slice(-3);
    try {
        return `[${code}] 姚` + words.map(w => `${w.word}(${w.type}, ${w.num})`).join('');
        // return '姚'
    } catch(e) {
        console.error('words2name failed, ', e);
        return '--';
    }
}


// File Upload
const fileRef = ref(null);
function importLocalFile() {
    fileRef.value.click();
}
async function importFileChange(event: Event) {
    const el = event.target as HTMLInputElement;
    const files = el.files;

    if (!files) {
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();
    const file = files[0]
      reader.readAsArrayBuffer(file)
      reader.onloadend = (e) => {
        const buffer = e?.target?.result
        const formatWordSheet = (worksheet: any) => {
            const result: WORD_ITEM[] = [];
            worksheet.eachRow((row: any, rowNumber: any) => {
                if (rowNumber === 1) return;

                result.push({
                    word: row.getCell('A').value,
                    type: row.getCell('B').value,
                    num: row.getCell('C').value,
                });
            });

          return result;
        }
        const formatRulesSheet = (worksheet: any) => {
            const result: RULE_ITEM[][] = [];
            worksheet.eachRow((row: any, rowNumber: any) => {
                if (rowNumber === 1) return;
                // console.log(row, rowNumber)
                const rowData: RULE_ITEM[] = [];
                let temp: RULE_ITEM = { type: WORD_TYPE.GOLD, num: 11 };

                row.eachCell((cell: any, colNumber: any) => {
                    let value = ''
                    // 判断单元格的类型
                    //    6-公式 ;2-数值；3-字符串。
                    if (cell.type == 6) {
                        value = cell.result
                    } else {
                        value = cell.value
                    }

                    // 偶数行
                    if (colNumber % 2 === 0) {
                        temp.num = parseInt(value);
                        rowData.push(temp);
                        temp = { type: WORD_TYPE.GOLD, num: 11 };
                    // 奇数行
                    } else {
                        temp.type = value as WORD_TYPE;
                    }
                });
                result.push(rowData)
            });

            return result
        }
        // 2.解析buffer
        workbook.xlsx.load(buffer).then((res: any) => {
            words.value = formatWordSheet(res.getWorksheet(1));
            rules.value = formatRulesSheet(res.getWorksheet(2));
            results.value = xql.generateName(toRaw(words.value), toRaw(rules.value));
            fileRef.value.blur();
        })
      }


}


function reset() {
    console.log('TODO: reset fail')
    words.value = [];
    rules.value = [];
    results.value = [[]];
}

</script>
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateBlocks} from '../src/lib/validation';
import {descriptionImages} from '../src/lib/content';

test('image/text pairs survive validation while unsafe image input fails closed',()=>{
 const block={type:'image',text:'商品结算信息',src:'/uploads/'+'a'.repeat(32)+'-1600.webp',layout:'card',detail:'付款前核对明细'};
 assert.deepEqual(validateBlocks([block]),[block]);
 assert.deepEqual(descriptionImages(JSON.stringify([block])),[block.src]);
 for(const src of ['javascript:alert(1)','/uploads/../../.env','https://example.com/a.webp',block.src.replace('.webp','.mp4'),''])assert.throws(()=>validateBlocks([{...block,src}]));
 assert.throws(()=>validateBlocks([{...block,layout:'html'}]));
 assert.deepEqual(validateBlocks([{...block,onerror:'alert(1)'}]),[block]);
 assert.deepEqual(validateBlocks([{type:'paragraph',text:'原有文字'}]),[{type:'paragraph',text:'原有文字'}]);
});
test('comparison tables require a header and consistent nonempty columns',()=>{
 assert.deepEqual(validateBlocks([{type:'table',text:'维度 | 决策\n支付 | 信用卡'}]),[{type:'table',text:'维度 | 决策\n支付 | 信用卡'}]);
 for(const text of ['只有一列','维度 | 决策\n支付','维度 | 决策\n支付 | '])assert.throws(()=>validateBlocks([{type:'table',text}]));
});

// var judgeResultTimer = null;
// 用于记录每个选项的数组
var stepDict = [];

function getStepChoosed(step,stepNum){
	var stepItems = step.find("li")
	for(var i = 0; i<stepItems.length; i++){
		if(stepItems.eq(i).hasClass("active")){
			if(!stepDict[stepNum]){
				stepDict[stepNum] = i;
			};
			return true;
		}
	}
	return false
}

function main(){
	var stepNum = 0;
	var stepList = $(".step-list");
	
	function chooseStep(){
		var step = stepList.eq(stepNum);
		// 判断当前步骤有没有选过
		var ifStepChoosed = getStepChoosed(step,stepNum);
		if(!ifStepChoosed){
			// 要选择的选项的编号，默认为0。即，如果当前步骤没有选择过，就默认选择第一项
			var chooseItemNum = 0;
			var stepItems = step.find("li");
			// if(stepNum === stepList.length - 1){
			// 	stepItems.eq(stepItems.length - 1).click();
			// }else{}
			
			// 如果 stepDict[stepNum] 存在，说明这个选项以前被选过，但是之前的选项有问题（缺货什么的），需要重新选。
			// 那么这次的选项就顺延，为以前的选项编号+1
			if(typeof stepDict[stepNum] !== "undefined" /*这么判断是为了避免数字0*/){
				chooseItemNum = stepDict[stepNum] + 1;
			}
			// 记录当前选项选了第几项
			stepDict[stepNum] = chooseItemNum;
			// 选择
			stepItems.eq(chooseItemNum).click();
		}
		stepNum ++;

		timer = setInterval(function(){
			var resultBtn = $("#J_chooseResult a");
			var nextBtn = $("#J_chooseResultInit a");
			// 说明页面还在重载，继续轮询
			if(resultBtn.length && resultBtn.html() === "正在加载..."){
				return;
			}
			// 否则，页面应该已经重载完了，可以进行分析了
			else{
				clearInterval(timer);
				console.log(clearInterval)
				// 下面之所以要重新获取一遍 stepList，有两个原因。第一，stepList是可变的，小米页面上的谋陷选项（如配件），会在点击前面的选项后出现。
				// 第二，页面会局部刷新，之前得到的 stepList 中的 dom 已经不是改变后的当前页面中的 dom 了。
				stepList = $(".step-list"); 
				// 如果 stepNum 小于总的list的长度，说明还有选项没有选，需要继续往下选，递归自身。
				if(stepNum < stepList.length){
					chooseStep();
				}
				else{
					juedgeResult();
				}
			}
		},200)
	}
	
	function juedgeResult(){
		var resultBtn = $("#J_chooseResult a");
		// 对应的按钮文本是“设置开售提醒”，意思估计是还未开售
		// if(resultBtn.hasClass("J_openSaleRegisterBtn")){}

		// 有这个 id 说明可以购买了，其他的都不能购买
		if(resultBtn.attr("id") === "J_proBuyBtn"){
			var endTime = new Date();
			var timeGap = endTime - startTime;
			console.log("timeGap:",timeGap);
			console.log(stepDict);
			resultBtn[0].click();
			// 点击了购买之后的timer，用来处理点击了购买但是没有成功跳转的情况。（比如缺货什么的）
			// 如果跳转了，这个loop就没用了，否则，会监听页面有没有弹出来的 modal 框，提示缺货。
			// 如果有，那就需要倒回去重新选择了，非常麻烦。
			var afterbuyLoop = setInterval(function(){

			},300);
		}
		// 选项都选完了，能成功购买的按钮还是没有出现，说明可能缺货或者还未开放购买（对应按钮文案为“设置开售提醒”）
		// 这是需要跳回去重新选。
		else{
			stepNum = 0;
			// 去掉页面上所有的 active class。
			clearStepChoose();
			chooseStep();
		}
	}

	function clearStepChoose(){
		for(var j = 0; j < stepList.length; j++){
			stepList.eq(j).find("li").removeClass("active");
		}
	}

	chooseStep();
	
}

var startTime = new Date();
main();

// setTimeout(1000,function(){
// 	var openSaleRegisterBtn = $(".openSaleRegisterBtn");
// 	if(openSaleRegisterBtn.length){
// 		//重新选择
// 	}
// })
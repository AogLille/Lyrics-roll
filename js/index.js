/**
 * 解析歌词字符串
 * 得到一个歌词对象
 * @param {String} lrc
 * @returns {Array<Object>} 对象数组，数组的每一项都是一句歌词及其对应时间
 */
function parseLrc(lrc) {
	let lrcObj = lrc.split('\n')
	let result = []
	lrcObj.forEach((element) => {
		// let a = element.slice(1, element.indexOf(']'))
		// let b = element.slice(element.indexOf(']') + 1)
		let parts = element.split(']')
		let timeStr = parts[0].slice(1)
		let obj = {
			time: parseTime(timeStr),
			words: parts[1],
		}
		result.push(obj)
	})
	return result
}

/**
 * 将一个时间字符串解析为数字（秒）
 * @param {String} timeSrc
 * @returns {Number} number类型的数字
 */
function parseTime(timeSrc) {
	let parts = timeSrc.split(':')
	return (+parts[0] * 60 + +parts[1]).toFixed(6)
}

// 歌词数组
let lrcData = parseLrc(lrc)

// 获取需要的dom
let doms = {
	audio: document.querySelector('audio'),
	lrcList: document.querySelector('.lrc-list'),
	box: document.querySelector('.box'),
}

/**
 * 计算出在播放器的某个时间
 * 应该高亮显示的歌词索引下标
 * @param {Array<Object>} 歌词数组对象
 * @returns {Number} 歌词下标
 */
function findIndex() {
	let curTime = doms.audio.currentTime
	for (let index = 0; index < lrcData.length; index++) {
		const element = lrcData[index]
		if (element.time > curTime+0.2) {
			return index - 1
		}
	}
	// 对于最后一句歌词，假设歌曲是280秒，最后一句歌词是275秒，如无法返回正确索引，需要进行特殊处理
	return lrcData.length - 1
}

/**
 * 创建歌词 li 标签
 */
function creatLrc() {
	lrcData.forEach((element) => {
		let li = document.createElement('li')
		li.innerText = element.words
		doms.lrcList.appendChild(li)
	})
}
creatLrc()

let boxHeight = doms.box.clientHeight // ul 高度
let liHeight = doms.lrcList.children[0].clientHeight

/**
 * 设置ul元素的偏移量
 */
function setOffset() {
	let index = findIndex()
	let curLi = doms.lrcList.children[index]
	if (curLi) {
		// 偏移量
		let offset = curLi.offsetTop + liHeight - boxHeight / 2
		if (offset < 0) {
			offset = 0
		}
		doms.lrcList.style.transform = `translateY(-${offset}px)`
		if (document.querySelector('.active')) {
			document.querySelector('.active').classList.remove('active')
		}
		curLi.classList.add('active')
	}
}

doms.audio.addEventListener('timeupdate',setOffset)
(function() {
	var _options = {
		// 移动速度
		duration: 8000,
		// 第几次滚动
		now: 0
	}
	var _rely = {
		/**
		 *子集移动，再返回到队尾。以此往复
		 *
		 * @param {*} childContainerWid
		 * @param {*} childTextWid
		 */
		tipsLoop: function(childContainerWid, childTextWid) {
			var loopSpeed, duration = _options.duration;
			if (_options.now == 0) {
				loopSpeed = parseInt(duration * childTextWid / (childContainerWid + childTextWid));
				_options.now++;
			} else {
				loopSpeed = duration;
				clearTimeout(_plugin_api.firstLoopTimer);
			}
			_rely.loop(loopSpeed, -childTextWid);
			setTimeout(() => {
				_rely.loop(0, childContainerWid);
			}, loopSpeed);
		},
		/**
		 *添加的元素移动
		 *
		 * @param {*} loopSpeed
		 * @param {*} transformX
		 */
		loop: function(loopSpeed, transformX) {
			$('.child_loop').css({
				'transition-duration': '' + loopSpeed + 'ms',
				'transform': 'translate3d(' + transformX + 'px, 0px, 0px)'
			})
		},
		/**
		 *获取元素宽度
		 *
		 * @param {*} html
		 * @param {*} font
		 * @returns
		 */
		getWidth: function(html, font) {
			var fon = font || '12px arial',
				$obj = $('<div>' + html + '</div>')
				.css({
					'position': 'absolute',
					'float': 'left',
					'white-space': 'nowrap',
					'visibility': 'hidden',
					'font': fon
				})
				.appendTo($('body')),
				$wid = $obj.width();
			$obj.remove();
			return $wid;
		}
	}
	var _plugin_api = {
		/**
		 *输出api
		 *
		 * @param {*} child
		 */
		rolling: function(child) {
			var fontSize = $(child).css('font-size'),
				fontFamily = $(child).css('font-family');
			var childTextWid = parseFloat(_rely.getWidth($(child).html(), fontSize + " " + fontFamily)),
				childContainerWid = parseFloat($(child)[0].clientWidth) - parseFloat($(child).css('padding-left')) - parseFloat($(child).css('padding-right'));
			var duration = _options.duration;
			if (childTextWid > childContainerWid) {
				var html = $(child).html();
				$(child).css({
					'width': '100%'
				}).html('<div class="child_container" style="overflow: hidden;"><div class="child_loop" style="transition-timing-function: linear; width: ' + childTextWid + 'px">' + html + '</div></div>');
				// 第一次滚动
				_plugin_api.firstLoopTimer = setTimeout(() => {
					_rely.tipsLoop(childContainerWid, childTextWid);
				}, parseInt(duration * childContainerWid / (childTextWid + childContainerWid)));
				// 第二次以后的滚动
				setInterval(function() {
					_rely.tipsLoop(childContainerWid, childTextWid)
				}, parseInt(duration + 100));
			}
		}
	}
	this.BeyondRolling = _plugin_api;
})();
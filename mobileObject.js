Tanks.MobileObject = atom.Class({
	Extends: Tanks.FieldObject,

	mv : true,
	speed : 0, //скорость (проводится перерассчет)

	move: function (shift) {
		var success = false;
		// можно управлять шириной объекта. ширина = width*(1 - 2*objDecr)
		// если objDecr>=0.5, то объект становится бестелесным: width*(1 - 2*(0.5)) = width*0
		// ecли objDecr=-0.5, то объект становится в два раза больше: width*(1 - 2*(-0.5)) = width*2
		if ('bullet' == this.objType) {
			this.objDecr = -0.5;
		} else {
			this.objDecr = 1.15*this.speed/this.shape.width;
			if (this.objDecr < 0.1) {
				this.objDecr = 0.1;
			} else if (this.objDecr > 0.45) {
				this.objDecr = 0.45;
			}
		}
		
		if ('tank' == this.objType) {
			this.mv = true;
		}

		this.addToGridArr(shift);

		var sides = {
			t: this.shape.y + this.shape.width*this.objDecr + shift.y,
			b : this.shape.to.y - this.shape.width*this.objDecr + shift.y,
			r : this.shape.to.x - this.shape.height*this.objDecr + shift.x,
			l : this.shape.x + this.shape.height*this.objDecr + shift.x
		};
		
		if (sides.t <=0 || sides.b >= glob.fspx.h || sides.l <= 0 || sides.r >= glob.fspx.w ) {
		// столкновение со стенами
			this.collision();
		} else {
		// столкновение с другими объектами
			var clList = [];
			var q;
			var q_to = this.workArr.length;
			var goBreak = false;
			for (q=0; q<q_to; q++) if (undefined != this.workArr[q]){

				var currCell = gridArr[ this.workArr[q].x ][ this.workArr[q].y ];
				var m;
				var m_to = currCell.length;

				for (m=0; m<m_to; m++)
				if (
					currCell[m]
				&&
					this != currCell[m]
				&&
					this.par != currCell[m]
				){
					if ( ('bullet' == this.objType) && ('water' == currCell[m].state || 'ice' == currCell[m].state || this.side == currCell[m].side) ) {
						break;
					}

					var neighSides = {
						t : currCell[m].shape.y,
						b : currCell[m].shape.to.y,
						r : currCell[m].shape.to.x,
						l : currCell[m].shape.x
					};

					if (sides.b >= neighSides.t && neighSides.b >= sides.t && sides.r >= neighSides.l && neighSides.r >= sides.l){

						if ('bullet' == this.objType) {

							if (this.crashMetal || currCell[m].state != 'metal') {

								if ('brick' == currCell[m].state) {

									var cur = currCell[m].coords;

									if (0 == this.dirn.x) { // движется вертикально
										if (fldBricks[ cur.x+0.25 ] && fldBricks[ cur.x+0.25 ][ cur.y ]) {
											clList.push(fldBricks[ cur.x+0.25 ][ cur.y ]);
											/*if (-1 == this.dirn.y && fldBricks[ cur.x+0.25 ][ cur.y+0.25 ]) {//вверх
												clList.push(fldBricks[ cur.x+0.25 ][ cur.y+0.25 ]);
											} else if (fldBricks[ cur.x+0.25 ][ cur.y-0.25 ]) { // вниз
												clList.push(fldBricks[ cur.x+0.25 ][ cur.y-0.25 ]);
											}*/
										}
										if (fldBricks[ cur.x-0.25 ] && fldBricks[ cur.x-0.25 ][ cur.y ]) {
											clList.push(fldBricks[ cur.x-0.25 ][ cur.y ]);
											/*if (-1 == this.dirn.y && fldBricks[ cur.x-0.25 ][ cur.y+0.25 ]) {//вверх
												clList.push(fldBricks[ cur.x-0.25 ][ cur.y+0.25 ]);
											} else if (fldBricks[ cur.x-0.25 ][ cur.y-0.25 ]) { // вниз
												clList.push(fldBricks[ cur.x-0.25 ][ cur.y-0.25 ]);
											}*/
										}
									} else { // движется горизонтально
										if (fldBricks[ cur.x ] && fldBricks[ cur.x ][ cur.y+0.25 ]) {
											clList.push(fldBricks[ cur.x ][ cur.y+0.25 ]);
											/*if (-1 == this.dirn.x && fldBricks[ cur.x+0.25 ] && fldBricks[ cur.x+0.25 ][ cur.y+0.25 ]) {//влево
												clList.push(fldBricks[ cur.x+0.25 ][ cur.y+0.25 ]);
											} else if (fldBricks[ cur.x-0.25 ] && fldBricks[ cur.x-0.25 ][ cur.y-0.25 ]) { // вправо
												clList.push(fldBricks[ cur.x-0.25 ][ cur.y-0.25 ]);
											}*/
										}

										if (fldBricks[ cur.x ] && fldBricks[ cur.x ][ cur.y-0.25 ]) {
											clList.push(fldBricks[ cur.x ][ cur.y-0.25 ]);
											/*if (-1 == this.dirn.x && fldBricks[ cur.x+0.25 ] && fldBricks[ cur.x+0.25 ][ cur.y-0.25 ]) { // влево
												clList.push(fldBricks[ cur.x+0.25 ][ cur.y-0.25 ]);
											} else if (fldBricks[ cur.x-0.25 ] && fldBricks[ cur.x-0.25 ][ cur.y-0.25 ]) { // вправо
												clList.push(fldBricks[ cur.x-0.25 ][ cur.y-0.25 ]);
											}*/
										}
									}
								}
							
								if ('tank' == currCell[m].objType) {
									currCell[m].minusHealth();
								} else {
									currCell[m].collision();
								}
							
								/*if ('bullet' == this.objType) 
								console.log('ok');*/

							}

							this.mv = false;
						} else { // обработка для танка: остановится перед первым встреченным препятствием
							this.collision();
							goBreak = true;
							break;
						}

					}
					
				}

				if (goBreak) break;
			}
		}

		if (this.mv) {
			this.shape.move(shift);
			success = true;
		} else if ('bullet' == this.objType) {
			this.shape.move(shift); // пуля пересекается с объектом и только потом взрывается
			this.collision();

			if (clList) {
				var l;
				var l_to = clList.length;
				for (l=0;l<l_to;l++){
					if (undefined != clList[l]) {
						clList[l].collision();
					}
				}
			}

		}


		this.libcanvas.update();
		
		return success;
	},

	collision : function(){
		this.mv = false;
		if ('bullet' == this.objType) {
			this.boom();
		}
	}
});
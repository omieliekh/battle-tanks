Tanks.FieldObject = atom.Class({
	Extends: DrawableSprite,

	id : null,
	workArr : null,
	objType : null,
	objDecr : 0,

	addToGridArr : function(shift){
		var sides = {};

		if (undefined !== shift) {
			/*sides = {
				t: Math.floor( this.shape.y/glob.bs ),
				b : Math.floor( (this.shape.to.y-1)/glob.bs ),
				r : Math.floor( (this.shape.to.x-1)/glob.bs ),
				l : Math.floor( this.shape.x/glob.bs )
			};*/

			sides = {};

			if (shift.y > 0) { //����
				sides.b = Math.floor( (this.shape.to.y-1 + shift.y)/glob.bs );
			} else if (shift.y < 0) { //�����
				sides.t = Math.floor( (this.shape.y + shift.y)/glob.bs );
			} else if (shift.x > 0) { //�����
				sides.l = Math.floor( (this.shape.x + shift.x)/glob.bs );
			} else if (shift.x < 0) { //������
				sides.r = Math.floor( (this.shape.to.x-1 + shift.x)/glob.bs );
			}

			if (!sides.l) {
				sides.l = Math.floor( this.shape.x/glob.bs );
			}
			if (!sides.t) {
				sides.t = Math.floor( this.shape.y/glob.bs );
			}
			if (!sides.r) {
				sides.r = Math.floor( (this.shape.to.x-1)/glob.bs );
			}
			if (!sides.b) {
				sides.b = Math.floor( (this.shape.to.y-1)/glob.bs );
			}

			/*sides = {
				t: Math.floor( (this.shape.y + shift.y)/glob.bs ),
				b : Math.floor( (this.shape.to.y-1 + shift.y)/glob.bs ),
				r : Math.floor( (this.shape.to.x-1 + shift.x)/glob.bs ),
				l : Math.floor( (this.shape.x + shift.x)/glob.bs )
			};*/
		} else {
			sides = {
				t: Math.floor( this.shape.y/glob.bs ),
				b : Math.floor( (this.shape.to.y-1)/glob.bs ),
				r : Math.floor( (this.shape.to.x-1)/glob.bs ),
				l : Math.floor( this.shape.x/glob.bs )
			};
		}

		if (sides.b > glob.fs.h-1){
			sides.b = glob.fs.h-1
		} else if (sides.b < 0) {
			sides.b = 0;
		}

		if (sides.t > glob.fs.h-1) {
			sides.t = glob.fs.h-1;
		} else if (sides.t < 0) {
			sides.t = 0;
		}

		if (sides.r > glob.fs.w-1){
			sides.r = glob.fs.w-1
		} else if (sides.r < 0) {
			sides.r = 0;
		}

		if (sides.l > glob.fs.w-1) {
			sides.l = glob.fs.w-1;
		} else if (sides.l < 0) {
			sides.l = 0;
		}

		this.rmFromGridArr();

		this.workArr = [];
		if (sides.l === sides.r) {
			if (sides.t === sides.b && gridArr[sides.l][sides.t]) {
				gridArr[sides.l][sides.t][this.id] = this;
				this.workArr.push({x:sides.l,y:sides.t});

			} else if (gridArr[sides.l] && gridArr[sides.l][sides.t] && gridArr[sides.l][sides.b]) {
				gridArr[sides.l][sides.t][this.id] = this;
				gridArr[sides.l][sides.b][this.id] = this;

				this.workArr.push({x:sides.l,y:sides.t});
				this.workArr.push({x:sides.l,y:sides.b});
			}
		} else if (gridArr[sides.l] && gridArr[sides.r] && gridArr[sides.l][sides.t] && gridArr[sides.l][sides.b] && gridArr[sides.r][sides.t] && gridArr[sides.r][sides.b]) {
			gridArr[sides.l][sides.t][this.id] = this;
			gridArr[sides.l][sides.b][this.id] = this;
			gridArr[sides.r][sides.t][this.id] = this;
			gridArr[sides.r][sides.b][this.id] = this;

			this.workArr.push({x:sides.l,y:sides.t});
			this.workArr.push({x:sides.l,y:sides.b});
			this.workArr.push({x:sides.r,y:sides.t});
			this.workArr.push({x:sides.r,y:sides.b});
		} else {
			console.log('wtf');
			console.log(sides);
		}
	},

	rmFromGridArr : function (){
		if (null != this.workArr) {
			var q;
			for (q=0; q<this.workArr.length; q++){
				gridArr[ this.workArr[q].x ][ this.workArr[q].y ][this.id] = undefined;
				//this.workArr[q] - ���������� ������ ����, ��������, ����� ������ ���� ��� ���������
			}
		}
	},

	rmFromGlob : function() {
		if (null != this.id) {
			globObj[this.id] = undefined;
		}

		this.rmFromGridArr();
		this.libcanvas.rmElement(this);
	}
});



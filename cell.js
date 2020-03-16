Tanks.Cell = atom.Class({
	Extends: Tanks.FieldObject,
	
	/**
	*	layer :		���� ��� ���������
	*	coords :	���������� ��� ���������. "+(j*scale)", "+(i*scale)" - �������� �� scale ��������
	*	state :		����� �������� ����� ��� �����
	*	spriteDim :	[j*(glob.ts*scale), i*(glob.ts*scale)] - ����� ����� �������� �����
	*	scale :		������ ������� �� ��������� � ������� �������� (�������: 1�1, ������: scale � scale )
	*/
	initialize: function (layer, coords, state, spriteDim, scale) {
		var self = this;
		this.state = state;
		this.lc = layer.addElement( this );
		
		//this.spriteDim = spriteDim;
		//this.scale = scale;
		
		this.coords = coords;
		
		this.sprite = this.lc.getImage('field_'+state).sprite(spriteDim.x, spriteDim.y, glob.ts*scale, glob.ts*scale);		
		this.shape  = new Rectangle(coords.x*glob.bs, coords.y*glob.bs, glob.bs*scale, glob.bs*scale);
		this.objType = 'barrier';
		
		if ('bush' != state && 'ice' != state) {
			this.id = glob.ids++;
			globObj[this.id] = this;
			this.addToGridArr();
		}
		
		if ('brick' == state){
			
			if (undefined == fldBricks[coords.x]) {
				fldBricks[coords.x] = [];
			}
			
			fldBricks[coords.x][coords.y] = this;			
		}
	},
	
	collision : function(){
		var self = this;

		if ('base' == this.state) {
			
			setTimeout( function(){ alert('Your base was destroyed.\nGAME OVER');/*console.log('GAME OVER');*/ }, 300 );
			//this.lc.rmAllElements();
			this.lc.stop();
			//this.lc.parentLayer.start();
			
			//console.log(this.lc);
			
			//Tanks = undefined;
		}
		
		this.rmFromGlob();
		this.lc.ctx.fillRect(new Rectangle(self.shape.x-0.25, self.shape.y-0.25, self.shape.width+0.5, self.shape.height+0.5));

		
	}
});


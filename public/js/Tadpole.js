var Tadpole = function() {
	var tadpole = this;
	
	this.x = Math.random() * 300 - 150;
	this.y = Math.random() * 300 - 150;
	this.size = 4;
	
	this.name = '';
	this.age = 0;
	
	this.momentum = 0;
	this.maxMomentum = 3;
	this.angle = Math.PI * 2;
	
	this.targetX = 0;
	this.targetY = 0;
	this.targetMomentum = 0;
	
	this.messages = [];
	this.timeSinceLastActivity = 0;
	
	this.changed = 0;
	this.timeSinceLastServerUpdate = 0;
	
	this.update = function(tadpoles) {
		tadpole.timeSinceLastServerUpdate++;
		
		tadpole.x += Math.cos(tadpole.angle) * tadpole.momentum;
		tadpole.y += Math.sin(tadpole.angle) * tadpole.momentum;
		
		if(tadpole.targetX != 0 || tadpole.targetY != 0) {
			tadpole.x += (tadpole.targetX - tadpole.x) / 20;
			tadpole.y += (tadpole.targetY - tadpole.y) / 20;
		}
		
		// Update messages
		for (var i = tadpole.messages.length - 1; i >= 0; i--) {
			var msg = tadpole.messages[i];
			msg.update();
			
			if(msg.age == msg.maxAge) {
				tadpole.messages.splice(i,1);
			}
		}
		
		tadpole.tail.update();
	};
	
	
	
	this.userUpdate = function(tadpoles, angleTargetX, angleTargetY) {
		this.age++;
		
		var prevState = {
			angle: tadpole.angle,
			momentum: tadpole.momentum,
		}
		
		// Angle to targetx and targety (mouse position)
		var anglediff = ((Math.atan2(angleTargetY - tadpole.y, angleTargetX - tadpole.x)) - tadpole.angle);
		while(anglediff < -Math.PI) {
			anglediff += Math.PI * 2;
		}
		while(anglediff > Math.PI) {
			anglediff -= Math.PI * 2;
		}
		
		tadpole.angle += anglediff / 5;
		
		// Momentum to targetmomentum
		if(tadpole.targetMomentum != tadpole.momentum) {
			tadpole.momentum += (tadpole.targetMomentum - tadpole.momentum) / 20;
		}
				
		if(tadpole.momentum < 0) {
			tadpole.momentum = 0;
		}
		
		tadpole.changed += Math.abs((prevState.angle - tadpole.angle)*3) + tadpole.momentum;
		
		if(tadpole.changed > 1) {
			this.timeSinceLastServerUpdate = 0;
		}
	};
	
	this.draw = function(context) {
		var opacity = Math.max(Math.min(20 / Math.max(tadpole.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);
		context.fillStyle = 'rgba(226,219,226,'+opacity+')';
		
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur    = 6;
		context.shadowColor   = 'rgba(255, 255, 255, '+opacity*0.7+')';
		
		// Draw circle
		context.beginPath();
		context.arc(tadpole.x, tadpole.y, tadpole.size, tadpole.angle + Math.PI * 2.7, tadpole.angle + Math.PI * 1.3, true); 
		
		tadpole.tail.draw(context);
		
		context.closePath();
		context.fill();
		
		context.shadowBlur = 0;
		context.shadowColor   = '';
		
		drawName(context);
		drawMessages(context);
	};
	
	var drawName = function(context) {
		context.font = 7 + "px 'proxima-nova-1','proxima-nova-2', arial, sans-serif";
		context.textBaseline = 'hanging';
		var width = context.measureText(tadpole.name).width;
		context.fillText(tadpole.name, tadpole.x - width/2, tadpole.y + 8);
	}
	
	var drawMessages = function(context) {
		tadpole.messages.reverse();
		for(var i = 0, len = tadpole.messages.length; i<len; i++) {
			tadpole.messages[i].draw(context, tadpole.x+10, tadpole.y+5, i);
		}
		tadpole.messages.reverse();
	};
	
	
	// Constructor
	(function() {
		tadpole.tail = new TadpoleTail(tadpole);
	})();
}

game.import('extension',{
    name:'武将AI',
	 precontent:function(config){
		 //------------------------------十人----------------------------------//
		lib.mode.identity.config.player_number.item={
			'2':'两人',
			'3':'三人',
			'4':'四人',
			'5':'五人',
			'6':'六人',
			'7':'七人',
			'8':'八人',
			'10':'十人',
		}
		lib.mode.guozhan.config.player_number.item={
			'2':'两人',
			'3':'三人',
			'4':'四人',
			'5':'五人',
			'6':'六人',
			'7':'七人',
			'8':'八人',
			'10':'十人',
		}
		lib.config.mode_config.identity.identity.push([],['zhu','zhong','zhong','zhong','nei','fan','fan','fan','fan','fan']);
		var ss={
			cssStyle:function(){
				var style=document.createElement('style');
				style.innerHTML="[data-number='10']>.player[data-position='1']{top:calc(200% / 3 - 145px);left:calc(95% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='2']{top:calc(100% / 3 - 120px);left:calc(95% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='3']{top:30px;left:calc(80% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='4']{top:5px;left:calc(65% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='5']{top:0;left:calc(50% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='6']{top:5px;left:calc(35% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='7']{top:30px;left:calc(20% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='8']{top:calc(100% / 3 - 120px);left:calc(5% - 75px);}";
				style.innerHTML+="[data-number='10']>.player[data-position='9']{top:calc(200% / 3 - 145px);left:calc(5% - 75px);}";
				document.head.appendChild(style);
			}
		};
		ss.cssStyle();
	},
    content:function(config){
		//------------------------------pay事项----------------------------------//
		game.save('AI_version',2.7);
		if(!lib.storage.AI_inted){
			console.log('AI未激活');
			if(!lib.storage.dateBefore){
				console.log('首次使用');
				var dateBefore=new Date();
				game.save('dateBefore',dateBefore.getTime());
				game.save('AIdays',0);
			}
			else{
				console.log('开始计时');
				var dateNow=new Date().getTime();
				var date=dateNow-lib.storage.dateBefore;
				console.log('已经过去'+Math.floor(date/60000)+'分钟了');
				var days=Math.floor(date/(24*3600*1000));
				game.save('AIdays',days);
				console.log('已使用:'+days+'天');
				if(days>7){
					alert('内个~看起来你的7天试用期已经到期了。很遗憾我们即将说再见。\n点击“购买”:挽留AI拓展。\n点击“确定”终止AI拓展的载入。');
					return ;
				}
			}
		}
		else console.log('AI已激活');
		ui.create.div=function(){
			var str,innerHTML,position,position2,style,divposition,listen;
			for(var i=0;i<arguments.length;i++){
				if(typeof arguments[i]=='string'){
					if(typeof str=='string'){
						innerHTML=arguments[i];
					}
					else{
						str=arguments[i];
					}
				}
				else if(get.objtype(arguments[i])=='div'||
					get.objtype(arguments[i])=='table'||
					get.objtype(arguments[i])=='tr'||
					get.objtype(arguments[i])=='td'||
					get.objtype(arguments[i])=='body') position=arguments[i];
				else if(typeof arguments[i]=='number') position2=arguments[i];
				else if(get.itemtype(arguments[i])=='divposition') divposition=arguments[i];
				else if(typeof arguments[i]=='object') style=arguments[i];
				else if(typeof arguments[i]=='function') listen=arguments[i];
			}
			if(str==undefined) str='';
			var node=document.createElement('div');
			for(var i=0;i<str.length;i++){
				if(str[i]=='.'){
					if(node.className.length!=0){
						node.className+=' ';
					}
					while(str[i+1]!='.'&&str[i+1]!='#'&&i+1<str.length){
						node.className+=str[i+1];
						i++;
					}
				}
				else if(str[i]=='#'){
					while(str[i+1]!='.'&&str[i+1]!='#'&&i+1<str.length){
						node.id+=str[i+1];
						i++;
					}
				}
			}
			if(position){
				if(position.className=='config switcher'){
					if(position.textContent=='激活smart AI'){
						if(!lib.storage.AI_inted){
							position.textContent='激活AI:'+lib.storage.AIdays+'天';
						}
						else{
							position.textContent='smart AI 已激活';
							node.ss=true;
						}
					}
				}
				if(typeof position2=='number'&&position.childNodes.length>position2){
					position.insertBefore(node,position.childNodes[position2]);
				}
				else{
					if(!node.ss) position.appendChild(node);
				}
			}
			if(style) node.css(style);
			if(divposition) node.setPosition(divposition);
			if(innerHTML) node.innerHTML=innerHTML;
			if(listen) node.listen(listen);
			return node;
		}
		if(config.checkUpdate){
			lib.arenaReady.push(function(){
				setTimeout(function(){
					var script=lib.init.js("http://qianwinter.site/",'update',function(){
						script.remove();
						var version=window.updateVersion;
						delete window.updateVersion;
						var log=window.changeLog;
						delete window.changeLog;
						var str='';
						for(var i=0;i<log.length;i++){
							str+=log[i]+'\n';
						}
						if(!lib.storage.AI_num) game.save('AI_num',0.01);
						console.log('服务器版本:'+version);
						console.log('本地版本:'+lib.storage.AI_version);
						var num=version-lib.storage.AI_version;
						if(num>0&&num>lib.storage.AI_num){
							var next=confirm('发现新版本AI拓展: V'+version+' 可用，是否下载？\n更新内容:\n'+str);
							if(next){
								window.open('http://qianwinter.site/AI/AI.zip');
							}
							else{
								game.save('AI_num',num);
							}
						}
						
					},function(){
						console.log('检查更新失败');
					});
				},5000)
			})
		}
		lib.arenaReady.push(function(){
			if((lib.config.mode_config.identity.player_number==10&&get.mode()=='identity')||(lib.config.mode_config.guozhan.player_number==10&&get.mode()=='guozhan')){
				if(lib.device){
					var zoom=function(num){
						var zoom=num;
						game.documentZoom=game.deviceZoom*zoom;
						document.documentElement.style.zoom=game.documentZoom;
					};
					zoom(0.8);
				}
				ui.arenalog.style.top='240px';
				ui.arenalog.style.height='35%';
				lib.translate.unknown8='九号位';
				lib.translate.unknown9='十号位';
			}
		})
		lib.arenaReady.push(function(){
		//------------------------------新的写法----------------------------------//
			lib.element.player.removeFujiang=function(){
				var hp=this.hp;
				var maxhp=this.maxHp;
				this.init(this.name1,'shibing');
				this.classList.remove('unseen2');
				this.hp=hp;
				this.maxHp=maxhp;
				this.update();
			}
			lib.element.player.isSameGroup=function(player){
				if(this==player) return true;
				if(this.identity=='unknown'||player.isUnseen()) return false;
				if(this.identity=='ye'||player.identity=='ye') return false;
				if(this.identity!=player.identity) return false;
				return true;
			}
			lib.element.player.replaceFujiang=function(name2){
				var hp=this.hp;
				var maxhp=this.maxHp;
				this.clearSkills();
				this.init(this.name1,name2);
				this.classList.remove('unseen2');
				this.hp=hp;
				this.maxHp=maxhp;
				this.update();
			}
			lib.element.player.addFujiang=function(name2){
				var hp=this.hp;
				var maxhp=this.maxHp;
				var name=this.name;
				this.uninit();
				this.init(name,name2);
				this.classList.remove('unseen2');
				this.hp=hp;
				this.maxHp=maxhp;
				this.update();
			}
			lib.element.player.hasCardTarget=function(card){
				if(typeof card=='string') card={name:card};
				if(!lib.filter.filterCard(card,this)){
					if(card.name=='sha'&&!this.num('he','zhuge')) return false;
					if(card.name!='sha') return false;
				} 
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];		 				
					if(this.canUse(card,pl)){
						if(pl==this){
							return true;
						}
						if(card.name=='jiedao'){
							for(var i=0;i<game.players.length;i++){
								if(game.players[i]!=this&&game.players[i].get('e','1')) return true;
							}
							return false;
						}
						if(ai.get.effect(pl,card,pl,pl)>=0){
							if(ai.get.attitude(this,pl)>=0) return true;
						}
						if(ai.get.effect(pl,card,pl,pl)<=0){
							if(ai.get.attitude(this,pl)<=0) return true;
						}						
					}
				}
				return false;
			}
			lib.element.player.isF=function(player){
				return ai.get.attitude(player,this)>0
			}
			lib.element.player.isBF=function(player){
				return ai.get.attitude(player,this)>=3
			}
			lib.element.player.isE=function(player){
				return ai.get.attitude(player,this)<0
			}
			lib.element.player.isBE=function(player){
				return ai.get.attitude(player,this)<=-3
			}
			lib.element.player.hasEnemy=function(){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]!=this&&ai.get.attitude(game.players[i],this)<0){
						return true;
					}
				}
				return false;
			}
			lib.element.player.isZZ=function(){
				return this.identity=='zhu';
			}
			lib.element.player.canbeSha=function(){
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(pl!=this&&ai.get.attitude(pl,this)<0){
						if(pl.canUse('sha',this)&&ai.get.effect(this,{name:'sha'},pl)>0){
							return true;
						}
					}
				}
				return false;
			}
			lib.element.player.isSafe=function(){
				if((this.hp/this.maxHp)>=0.67) return true;
				if(this.hp>=4) return true;
				if(this.hp!=1&&this.num('h')-this.hp>=3) return true;
				if(this.hp<=1&&!this.hasSkill('buqu')) return false; 
				if(!this.canbeSha()) return true;
				if(this.num('e','2')&&this.get('e','2').name!='baiyin'&&Math.random()<0.7) return true;
				return false;
			}
			lib.element.player.hasLebuFirend=function(){
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(pl.isBF(this)&&pl.get('j','lebu')){
						if(!pl.hasSkill('zongshi')&&!pl.hasSkill('keji')&&!pl.hasSkill('guanxing')&&!pl.hasSkill('qiaobian')){
							if(pl.num('h')>=pl.hp+1) return true;
						}
					}
				}
				return false;
			}
			lib.element.player.hasBingFirend=function(){
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(pl.isBF(this)&&pl.get('j','bingliang')){
						if(!pl.hasSkill('guanxing')&&!pl.hasSkill('qiaobian')){
							if(pl.num('h')<=pl.hp+2) return true;
						}
					}
				}
				return false;
			}
			lib.element.player.hasJudgeFirend=function(){
				return this.hasLebuFirend()||this.hasBingFirend();
			}
			lib.element.player.hasShaTarget=function(){
				var cards=this.get('he');
				var list=[];
				for(var i=0;i<cards.length;i++){
					if(get.subtype(cards[i])=='equip1'){
						var dist=lib.card[cards[i].name].distance;
						if(!dist) list.push('1');
						else list.push(-dist.attackFrom+1)
					}
				}
				list.sort(function(a,b){
					return b-a
				})
				if(list[0]){
					for(var i=0;i<game.players.length;i++){
						var pl=game.players[i];
						if(pl==this) continue;
						if(get.distance(this,pl)<=list[0]){
							if(ai.get.effect(pl,{name:'sha'},pl,pl)>0){
								if(ai.get.attitude(this,pl)>0) return true;
							}
							if(ai.get.effect(pl,{name:'sha'},pl,pl)<=0){
								if(ai.get.attitude(this,pl)<=0) return true;
							}
						}
					}
				}
				return false;
			}
			lib.element.player.hasSaveFriend=function(){
				var jijiu=get.skillOwner('jijiu')&&get.skillOwner('jijiu').isF(this)&&(get.skillOwner('jijiu').num('e',{color:'red'})||get.skillOwner('jijiu').num('h')>=2);
				var buyi=get.skillOwner('buyi')&&get.skillOwner('buyi').isF(this);
				var renxin=get.skillOwner('renxin')&&get.skillOwner('renxin').isF(this)&&get.skillOwner('renxin').num('e');
				var chunlao=get.skillOwner('chunlao')&&get.skillOwner('chunlao').isF(this)&&get.skillOwner('chunlao').storage.chunlao;
				var huomo=get.skillOwner('huomo')&&get.skillOwner('huomo').isF(this)&&(get.skillOwner('huomo').num('e',{color:'black'})||get.skillOwner('huomo').num('h')>=5);
				var zhenzhan=get.skillOwner('zhenzhan')&&get.skillOwner('zhenzhan').isF(this)&&get.skillOwner('zhenzhan').num('h')>=3;
				if(jijiu||buyi||renxin||chunlao||huomo||zhenzhan) return true;
				return false;
			}
			lib.element.player.isBigPop=function(){
				if(this.identity=='unknown') return false;
				var wei=game.countPlayer(function(target){
					return target.identity=='wei';
				})
				var shu=game.countPlayer(function(target){
					return target.identity=='shu';
				})
				var wu=game.countPlayer(function(target){
					return target.identity=='wu';
				})
				var qun=game.countPlayer(function(target){
					return target.identity=='qun';
				})
				var num=get.population(this.identity);
				if(num==Math.max(wei,shu,wu,qun)) return true;
			}
			lib.element.player.isMinPop=function(){
				if(this.identity=='unknown') return false;
				var wei=game.countPlayer(function(target){
					return target.identity=='wei';
				});
				var shu=game.countPlayer(function(target){
					return target.identity=='shu';
				});
				var wu=game.countPlayer(function(target){
					return target.identity=='wu';
				});
				var qun=game.countPlayer(function(target){
					return target.identity=='qun';
				});
				var list=[];				
				list.push(wei,shu,wu,qun);
				list.sort(function(a,b){
					return a-b
				});
				for(var i=0;i<list.length;i++){
					if(list[i]!=0){
						var lgroup=list[i];
						break;
					}
				}
				if(get.population(this.identity)!=lgroup) return false;
				return true;
			}
			get.friendCount=function(player){
				var num=game.countPlayer(function(target){
					return target.isF(player)
				})
				return num;				
			}
			get.enemyCount=function(player){
				var num=game.countPlayer(function(target){
					return target.isE(player)
				})
				return num;				
			}
			get.maxUse=function(player){
				var num=0;
				var cards=player.get('h');
				for(var i=0;i<cards.length;i++){
					if(cards[i].name!='sha'&&player.hasCardTarget(cards[i])) num++;
				}
				if(player.num('h','sha')&&player.hasCardTarget('sha')) num++;
				return num;
			}
			get.maxShaEffect=function(player){
				var listSha=[];
				var listTarget=[];
				var target=[];
				if(!lib.filter.filterCard({name:'sha'},player)) return 0;
				var shas=player.get('h','sha');
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(player.canUse('sha',pl)&&pl.isE(player)){
						for(var j=0;j<shas.length;j++){
							listSha.push(ai.get.effect(pl,shas[j],player));
						}
						listSha.sort(function(a,b){
							return b-a
						});
						listTarget.push([listSha[0],pl]);
					}
				}
				if(listTarget.length){
					listTarget.sort(function(a,b){
						return b[0]-a[0]
					});
					if(listTarget[0][0]>0) return listTarget[0][1];
				}
				return 0;
			}
			get.mostProtect=function(player){	
				for(var i=0;i<game.players.length;i++){
					if(ai.get.attitude(player,game.players[i])<=0) continue;
					var pl=game.players[i];
					if(pl.isSafe()) continue;
					if(pl.hasSkill('buqu')) continue;
					if(!target) var target=pl;
					if(ai.get.damageEffect(target,player,player)>ai.get.damageEffect(pl,player,player)) target=pl;
				}
				if(target) return target;
				return 0;
			}
			get.mostDamage=function(player){	
				for(var i=0;i<game.players.length;i++){
					if(ai.get.attitude(player,game.players[i])>0) continue;
					var pl=game.players[i];
					if(pl.isSafe()) continue;
					if(!target) var target=pl;
					if(ai.get.damageEffect(target,player,player)<ai.get.damageEffect(pl,player,player)) target=pl;
				}
				if(target) return target;
				return 0;
			}
			ai.get.gainEffect=function(player1,player2){
				if(ai.get.attitude(player1,player2)<=0) return 0;
				var num=20;
				var num2=get.distance(player1,player2,'absolute');
				if(num2<1) num2=1;
				if(player2.num('j','lebu')) num-=6;
				if(player2.num('j','bingliang')) num+=2;
				if(player2.isTurnedOver()) num-=3;
				num+=ai.get.attitude(player1,player2)/3;
				if(player2.get('e','3')) num-=2.5;
				if(player2.get('e','2')) num-=1.5;
				num-=player2.hp+player2.num('h')*2;
				var listMore=['rende','paoxiao','jizhi','zhiheng','qixi','reqixi','guose','jieyin','qingnang','kanpo','tianyi','luanji','shuangxiong','duanliang','dimeng','jiuchi','qiaobian','beige','retieji','jijiu','bifa','yongsi','mizhao','mingzhe','duwu','zhenwei','xiaoguo','zhendu','duanbing','xuanfeng','yuce','jianying','yijue','renjie','qizhi','linpin'];
				var listLess=['guanxing','lianying','tiaoxin','fangquan','guzheng','shangshi','luoying','qice','zhanjue','tianming'];
				for(var i=0;i<player2.skills.length;i++){
					if(listMore.contains(player2.skills[i])){
						num+=4;
						break;
					}
					if(listLess.contains(player2.skills[i])){
						num-=5;
						break;
					}
				}
				if(num-num2*4/7<0) return 0;
				return num-num2*4/7;				
			}
			ai.get.disEffect=function(player1,player2){
				if(ai.get.attitude(player1,player2)>=0) return 0;
				var num=20;
				if(!player2.num('he')) return 0;
				if(player2.num('j','lebu')) num-=2;
				if(player2.isTurnedOver()) num+=2;
				num+=-ai.get.attitude(player1,player2)/3;
				if(player2.get('e','5')) num+=5;
				if(player2.get('e','3')) num+=3;
				if(player2.get('e','2')) num+=2.5;
				if(player2.get('e','1')) num+=2;
				num-=player2.hp+player2.num('h')*2;
				var listMore=['rende','paoxiao','jizhi','zhiheng','qixi','reqixi','guose','jieyin','qingnang','kanpo','tianyi','luanji','shuangxiong','duanliang','dimeng','jiuchi','qiaobian','beige','retieji','jijiu','bifa','yongsi','mizhao','mingzhe','duwu','zhenwei','xiaoguo','zhendu','duanbing','xuanfeng','yuce','jianying','yijue','renjie','leiji','huomo'];
				var listLess=['kongcheng','tuntian','lianying','tiaoxin','fangquan','guzheng','shangshi','luoying','qice','zhanjue','luoying','tianming'];
				for(var i=0;i<player2.skills.length;i++){
					if(listMore.contains(player2.skills[i])){
						num+=4;
						break;
					}
					if(listLess.contains(player2.skills[i])){
						num-=5;
						break;
					}
				}
				if(num<0) return 0;
				return num;			
			}
			get.playerRank=function(name){
				switch(get.rank(name)){
					case 's':return 5;break;
					case 'ap':return 4;break;
					case 'a':return 3;break;
					case 'am':return 2;break;
					case 'bp':return 1;break;
					default: return 0;
				}
			}
			get.skillOwner=function(skill){
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].hasSkill(skill)) return game.players[i];
				}
				return 0;
			}
			//------------------------------标准----------------------------------//
			lib.skill.jijiu.ai={
				skillTagFilter:function(player){
					return player.num('he',{color:'red'})>0&&_status.currentPhase!=player;
				},
				threaten:1.5,
				save:true,
				effect:{
					player:function(card,player,target){
						if(player.num('h')<=player.hp){
							if(get.color(card)=='red'){
								if(card.name!='wuzhong'&&card.name!='shunshou'&&card.name!='yuanjiao'&&card.name!='tao') return [0,0,0,0]
							}
						}
					}
				}
			}
			lib.skill.zhiheng={
				audio:2,
				enable:'phaseUse',
				position:'he',
				filterCard:true,
				usable:1,
				selectCard:function(){
					return [1,Infinity];
				},
				prepare:function(cards,player){
					player.$throw(cards,1000);
				},
				discard:false,
				delay:0.5,
				prompt:'弃置任意张牌并摸等量的牌',
				check:function(card){
					var player=_status.currentPhase;
					if(player.num('he','zhuge')&&player.num('he')>=6){
						return get.subtype(card)!='equip4'&&card.name!='sha'&&card.name!='zhuge';
					}
					if(player.isSafe()) return 6.5-ai.get.value(card);
					return 6-ai.get.value(card);
				},
				content:function(){
					'step 0'
					player.draw(cards.length);
					'step 1'
					for(var i=0;i<cards.length;i++){
						ui.discardPile.appendChild(cards[i]);
					}
				},
				ai:{
					order:function(skill,player){
						if(player.num('he','zhuge')&&player.num('he')>=6) return 7;
						return 1;
					},
					result:{
						player:1
					},
					effect:{
						target:function(card,player,target,current){
							if(target.get('e','1')){
								if(get.subtype(card)=='equip1') return 0;
							}
						}
					},
					threaten:1.5
				}
			}
			lib.skill.wusheng.ai.order=3
			lib.skill.wusheng.check=function(card){
				var player=_status.event.player;
				if(player.hp==1&&_status.currentPhase!=player) return 8-ai.get.value(card);
				return 5-ai.get.value(card);
			}
			lib.skill.tiandu.ai={
				effect:{
					target:function(card,player,target){
						if(target.num('e','bagua')){
							if(get.tag(card,'respondShan')) return [0.5,1];	
						}					
					}
				} 
			}
			lib.skill.yiji.content=function(){
				"step 0"
				player.draw(2*trigger.num);
				"step 1"
				event.cards=result;
				"step 2"
				player.chooseCardTarget({
					filterCard:function(card){
						return _status.event.parent.cards.contains(card);
					},
					selectCard:[1,event.cards.length],
					filterTarget:function(card,player,target){
						return player!=target;
					},
					ai1:function(card){
						if(ui.selected.cards.length>0) return -1;
						if(!player.get('j','lebu')&&card.name=='tao') return -1;
						if(player.num('h')<=player.hp+1) return -1;
						return (_status.event.player.num('h')-_status.event.player.hp+1);
					},
					ai2:function(target){
						if(_status.currentPhase.hasSkill('luanji')&&target==_status.currentPhase&&_status.currentPhase.isBF(player)) return 20;
						return ai.get.gainEffect(player,target)
					},
					prompt:'请选择要送人的卡牌'
				})
				"step 3"
				if(result.bool){
					result.targets[0].gain(result.cards);
					player.$give(result.cards.length,result.targets[0]);
					for(var i=0;i<result.cards.length;i++){
						event.cards.remove(result.cards[i]);
					}
					if(event.cards.length) event.goto(2);
				}
			}
			lib.skill.rende.check=function(card){
				if(ui.selected.cards.length) return 0;
				var player=_status.currentPhase;
				if(player.hp==player.maxHp||player.storage.rende<0||player.num('h')<=1){
					var ph=get.skillOwner('haoshi');
					if(ph&&player.isF(ph)&&ph.isF(player)){
						return 11-ai.get.value(card);
					}
					var pl=get.skillOwner('jieming');
					if(pl&&player.isF(pl)&&pl.isF(player)){
						if(player.num('h',function(card){
							return card.name!='sha'&&get.tag(card,'damage')
						})&&!pl.num('e','tengjia')){
							if(player.num('h')>1){
								if(player.num('h',function(card){
									return card.name!='sha'&&get.tag(card,'damage')
								})<player.num('h')){
									return (card.name=='sha'||!get.tag(card,'damage'))
								}
								else{
									return 11-ai.get.value(card)
								}
							}
							return -1;
						}
						if(player.num('h','sha')&&player.canUse({name:'sha'},pl)){
							if(player.num('h')>1||!lib.filter.filterCard('sha',player)){
								if(player.num('h','sha')!=player.num('h')){
									return card.name!='sha'
								}
								else{
									return 11-ai.get.value(card)
								}
							}
							return -1;
						}
					}
					if(player.num('h')>player.hp) return 10-ai.get.value(card);
					if(player.num('h')>2) return 6-ai.get.value(card);
					return -1;
				}
				return 10-ai.get.value(card);
			}
			lib.skill.rende.ai={
				threaten:0.8,
				order:function(skill,player){
					var pl=get.skillOwner('jieming');
					if(pl&&pl.isF(player)&&player.isF(pl)){
						if(player.num('e','zhuge')&&player.num('h','sha')>1) return 3;
						return 6;
					}
					if(player.hp<player.maxHp&&player.storage.rende<2&&player.num('h')>1){
						return 10;
					}
					return 1;
				},
				result:{
					target:function(player,target){
						if(target.num('j','lebu')) return 0;
						if(!target.isF(player)) return 0;
						var nh=target.num('h');
						var np=player.num('h');
						var pl=get.skillOwner('qiaoshi');
						if(get.skillOwner('jieming')) return ai.get.gainEffect(player,target);
						if(pl&&pl.isF(player)&&player.num('h')==pl.num('h')+2&&player.num('h')-2<=player.hp&&player.storage.rende==1) return 20;
						if(player.hp==player.maxHp||player.storage.rende<0||player.num('h')<=1){
							if(nh>=np-1&&np<=player.hp&&!target.hasSkill('haoshi')) return 0;
						}
						return ai.get.gainEffect(player,target);
					}
				},
				effect:{
					player:function(card,target,player){
						var pl=get.skillOwner('jieming');
						if(!pl||!pl.isBE(player)||!player.isBE(pl)) return;
						if(player.num('h')>1){
							if(card.name=='nanman'||card.name=='wanjian'){
								return [0,-10];
							}
						}
						return [1,3,1,3];
					},
					target:function(card,player,target){
						if(card.name=='nanman'||card.name=='wanjian'){
						if(!player.num('j','lebu')&&player.num('h')>=player.hp&&!player.isDamaged()) return 0;
						}
					}
				}
			}
			lib.skill.kurou.ai={
				order:10,
				result:{
					player:function(player){
						for(var i=0;i<game.players.length;i++){
							var pl=game.players[i];
							if(ai.get.attitude(player,pl)<2) continue;
							if(pl.hasSkill('jijiu')&&pl.num('he',{color:'red'})){
								return 1;
							}
							if(pl.hasSkill('buyi')&&player.num('h',{type:'basic'})<player.num('h')/2){
								return 1;
							}
						}
						if(player.num('he','zhuge')&&player.hp>1) return 1;
						if(player.num('h')>=player.hp-1) return -1;
						if(player.hp<3) return -1;
						return 1;
					}
				}
			}
			lib.skill.lianying.ai.effect.player=function(card,player,target,current){
				if(_status.dying) return ;
				if(get.maxUse(player)==player.num('h')) return [1,2]
			}
			lib.skill.lijian.ai.result.target=function(player,target){
				if(ui.selected.targets.length==0){
					if(target.hasSkill('yuce')&&target.hp!=1) return 0;
					if(target.hasSkill('wangxi')&&target.hp!=1) return -1;
					if(target.hasSkill('jiang')) return -2;
					if(target.hasSkill('reganglie')||target.hasSkill('ganglie')) return -3.5;
					if(target.hasSkill('fankui')||target.hasSkill('refankui')) return -4;
					if(target.hasSkill('enyuan')) return -5;
					return -3;
				}
				else{
					var pl=ui.selected.targets[0];
					if(pl.hp==1&&pl.num('h')<=3&&pl.identity=='fan'){
						return ai.get.effect(pl,{name:'juedou'},target,player)
					}
					if(target.hasSkill('reluoyi2')&&target.num('h')>=3) return 20;
					return ai.get.effect(pl,{name:'juedou'},target,pl);
				}
			}
			//------------------------------山----------------------------------//
			lib.skill.beige.audio=2
			lib.skill.qiaobian4.content=function(){
				"step 0"
				var discard=player.num('h')>player.hp;
				var guzheng=get.skillOwner('guzheng');
				if(guzheng&&guzheng.isF(player)) discard=false;
				var qiaoshi=get.skillOwner('qiaoshi');
				if(qiaoshi&&qiaoshi.isF(player)){
					if(player.num('h')-player.hp<=2&&qiaoshi.hp==player.hp) discard=false;
				}
				var next=player.chooseToDiscard('是否发动巧变跳过弃牌阶段？');
				next.logSkill='qiaobian';
				next.ai=function(card){
					if(discard){
						return 100-ai.get.useful(card);
					}
					else{
						return -1;
					}
				};
				"step 1"
				if(result.bool){
					trigger.untrigger();
					trigger.finish();
				}
			}
			lib.skill.tiaoxin.ai.order=5
			lib.skill.tiaoxin.content=function(){
				"step 0"
				target.chooseToUse({name:'sha'},player,-1,'挑衅：对'+get.translation(player)+'使用一张杀,或令其弃置你的一张牌').set('targetRequired',true);
				"step 1"
				if(result.bool==false&&target.num('he')>0){
					game.delay();
					player.discardPlayerCard(target,'he',true);
				}
				else{
					event.finish();
				}
			}
			lib.skill.tiaoxin.ai.result.player=function(player,target){
				if(target.num('h')==1) return -0.2;
				if(player.num('e','2')&&player.get('e','2').name!='baiyin') return -0.3;
				if(player.num('h','shan')==0) return -0.75;
				if(player.hp<=2) return -2;
				return -target.num('h')/4-0.05;
			}
			lib.skill.zhiji.ai={
				effect:{
					target:function(card,player,target,current){
						if(!target.hasSkill('guanxing')&&get.tag(card,'loseCard')&&target.num('h')==1&&(_status.currentPhase.next==target||_status.currentPhase.next.next==target)) return[1,3*Math.random()+0.2];
					}
				}
			}
			lib.skill.fangquan.content=function(){
				"step 0"
				var fang=player.hp>=2&&player.num('h')<=player.hp+2&&!player.num('h','wuzhong');
				if(player.num('h','tao')&&player.num('h')>=player.hp+2) fang=false;
				player.chooseTarget('是否发动【放权】？',function(card,player,target){
					return target!=player;
				}).ai=function(target){
					var num=0;
					var pl=get.skillOwner('guzheng');
					if(!(pl&&pl.isF(player)&&pl.num('j','lebu'))&&!fang) return -1;
					if(ai.get.attitude(player,target)<=0) return -1;
					if(target.num('j','lebu')||target.num('j','bingliang')) num-=2.5;
					if(target.hasSkill('zhiji')&&target.num('h')==0&&!target.hasSkill('guanxing')) num+=4;
					if(target.hasSkill('zaoxian')&&target.storage.tuntian.length>=3&&!target.hasSkill('jixi')) num+=5;
					if(target.hasSkill('hunzi')&&target.hp==1&&!target.hasSkill('yingzi')) num+=5.5;
					if(target.hasSkill('zili')&&target.storage.quanji.length>=3&&!target.hasSkill('paiyi')) num+=6;
					return get.playerRank(target.name)*0.7+ai.get.attitude(player,target)*0.3+num;
				}
				"step 1"
				if(result.bool){
					player.logSkill('fangquan',result.targets);
					trigger.untrigger();
					trigger.finish();
					player.addSkill('fangquan2');
					player.storage.fangquan=result.targets[0];
				}
			}
			lib.skill.tuntian.ai.effect.target=function(card,player,target,current){
				if(!target.hasFriend()) return;
				if(get.tag(card,'loseCard')&&_status.currentPhase!=target&&target.num('he')&&!target.hasSkill('jixi')&&target.storage.tuntian.length==2){
					return [0,10];
				}
				if(get.tag(card,'respondSha')||get.tag(card,'respondShan')){
					if(target.num('h')==0) return 2;
					return [1,target.num('h')/2];
				}
			}
			lib.skill.jiang.ai={
				effect:{
					target:function(card,player,target){
						if(card.name=='sha'&&get.color(card)=='red') return [1,0.6];
						if(card.name=='juedou') return [1,0.6];
					},
					player:function(card,player,target){
						if(card.name=='sha'&&get.color(card)=='red') return [1,0.6];
						if(card.name=='juedou') return [1,0.5];
					}
				}
			}
			lib.skill.hunzi.ai.effect.target=function(card,player,target){
				if(!target.hasFriend()) return;
				if(player.hasSkill('reyingzi')) return ;
				if(_status.dying) return ;
				if(get.tag(card,'damage')==1&&_status.currentPhase!=target){
					var hp=target.hp;
					if(target.hp>=4) return [1,0.7];
					if(target.hp==3) return [1,1.5];
					if(target.hp==2) return [1,3];
				}
				if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
			}
			lib.skill.zhijian.check=function(card){
				var player=_status.currentPhase;
				var num=0;
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(get.distance(player,pl)<=1&&ai.get.effect(pl,{name:'sha'},player)>0&&player.num('h','sha')>=3){
						num++;
					}
				}
				if(num){
					if(card.name=='zhuge') return -1;
				}
				if(player.num('he',{subtype:get.subtype(card)})>1){
					return 11-ai.get.equipValue(card);
				}
				return 6-ai.get.value(card);
			}
			lib.skill.zhijian.ai.result={			
				target:function(player,target){
					if(target.hasSkillTag('noe')) return 5;
					if(target.hasSkill('renxin')) return 4;
					if(ui.selected.cards[0]&&ui.selected.cards[0].name=='tengjia'){
						if(target.hasSkillTag('maixie')) return -2;
						var pl=get.skillOwner('huoji');
						if((pl&&pl.isF(player))||(player.num('h','huogong')&&player.num('h')>=5))
							return -4;
					}
					if(ui.selected.cards[0]&&ui.selected.cards[0].name=='guding'){
						if(target.hasSkill('xinpojun')) return 4;
						if(target.hasSkill('moukui')) return 3.7;
						if(target.hasSkill('chongzhen')) return 3.5;
					}
					if(ui.selected.cards[0]&&ui.selected.cards[0].name=='guanshi'){
						if(target.hasSkill('jiushi')) return 4;
						if(target.hasSkill('reluoyi')) return 3.5;
					}
					return 3;
				}
			}
			lib.skill.guzheng.trigger={global:'phaseDiscardAfter'}
			lib.skill.guzheng.content=function(){
				"step 0"
				game.delay();
				"step 1"
				event.cards=trigger.cards.slice(0);
				for(var i=0;i<event.cards.length;i++){
					if(get.position(event.cards[i])!='d'){
						event.cards.splice(i,1);i--;
					}
				}
				if(event.cards.length==0){
					event.finish();
					return;
				}
				player.chooseCardButton(event.cards,'固政:选择令'+get.translation(trigger.player)+'收回的牌').ai=function(button){
					if(trigger.player.isF(player)) return get.type(button.link)=='basic'?10:1;
					if(trigger.player.isE(player)){
						if(event.cards.length>=3) return 10-ai.get.value(button);
					}
					if(event.cards.length>=2) return 10-ai.get.value(button);
					return 0;
				}
				"step 2"
				if(result.bool){
					player.logSkill('guzheng',trigger.player);
					trigger.player.gain(result.buttons[0].link);
					trigger.player.$gain2(result.buttons[0].link);
					game.log(trigger.player,'收回了',result.buttons[0].link);
					event.cards.remove(result.buttons[0].link);
					if(event.cards.length){
						player.gain(event.cards);
						player.$gain2(event.cards);
						game.log(player,'收回了',event.cards);
					}
					game.delay();
				}
			}
			//------------------------------林----------------------------------//
			lib.skill.duanliang.ai.order=function(skill,player){
				if(player.num('e','guding')&&get.maxShaEffect(player)&&get.maxShaEffect(player).num('h')) return 3;
				return 9;
			}
			lib.skill.luanwu.ai.order=function(skill,player){
				if(player.num('h','nanman')) return 10;
			}
			lib.skill.weimu={
				audio:2,
				trigger:{target:'useCardToBefore'},
				priority:15,
				forced:true,
				filter:function(event,player){
					if(!event.target) return false;
					if((get.type(event.card)=='trick'||get.type(event.card)=='delay')&&
					get.color(event.card)=='black') return true;
				},
				content:function(){
					trigger.untrigger();
					trigger.finish();
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(get.type(card,'trick')=='trick'&&get.color(card)=='black') return [0,0,0,0];
						}
					}
				}
			}
			lib.skill.fangzhu.content=function(){
				"step 0"
				player.chooseTarget('是否发动【放逐】？',function(card,player,target){
					return player!=target
				}).ai=function(target){
					var player=_status.event.player;
					var pl=_status.currentPhase;
					if(ai.get.attitude(_status.event.player,target)==0) return 0;
					if(ai.get.attitude(_status.event.player,target)>=0){
						if(target.hasSkill('luanji')) return 200;
						if(target.classList.contains('turnedover')) return 200-target.num('h');
						if(player.maxHp-player.hp>=2){
							if(pl.hasSkill('kuiwei')||pl.hasSkill('jushou')||pl.hasSkill('lihun')) return 2.5*pl.num('h');
						}
						if(player.maxHp-player.hp<3) return -1;
						return 100-target.num('h');
					}
					else{
						if(player.maxHp-player.hp>=3) return -1;
						var num=0;
						if(target.hasSkill('zaoxian')&&target.storage.tuntian.length>=3&&!target.hasSkill('jixi')) num+=5;
						if(target.hasSkill('hunzi')&&target.hp==1&&!target.hasSkill('yingzi')) num+=5.5;
						if(target.hasSkill('zili')&&target.storage.quanji.length>=3&&!target.hasSkill('paiyi')) num+=6;
						if(target.hasSkill('zhiji')&&target.num('h')==0&&!target.hasSkill('guanxing')) num+=6.5;
						if(target.classList.contains('turnedover')) return -1;
						var dis=get.distance(pl,target,'absolute');
						if(dis<1) dis=2;
						return (1+target.num('h')+num)/Math.sqrt(dis)+get.playerRank(target.name)/2;
					}
				}
				"step 1"
				if(result.bool){
					player.logSkill('fangzhu',result.targets);
					result.targets[0].draw(player.maxHp-player.hp);
					result.targets[0].turnOver();
				}
			}
			lib.skill.yinghun.content=function(){
				"step 0"
				player.chooseTarget('是否发动【英魂】？',function(card,player,target){
					return player!=target;
				}).ai=function(target){
					if(player.maxHp-player.hp==1){
						if(target.num('he')==0) return 0;
						if(!target.isF(player)) return 0;
					}
					if(ai.get.attitude(_status.event.player,target)>0){
						if(target.hasSkill('tuntian')) return 18;
						if(target.hasSkillTag('noe')) return 22;
						
						return ai.get.gainEffect(_status.event.player,target);
					}
					if(ai.get.attitude(_status.event.player,target)<0&&player.hp<=1){
						if(target.num('h')<=1) return 0;
						if(target.hasSkillTag('noe')) return 0.001;
						return ai.get.disEffect(_status.event.player,target);
					}
					return 1;
				}
				"step 1"
				if(result.bool){
					player.logSkill('yinghun',result.targets);
					event.target=result.targets[0];
					player.chooseControl('yinghun_true','yinghun_false',function(event,player){
						if(ai.get.attitude(player,event.target)>0) return 'yinghun_true';
						return 'yinghun_false';
					})
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.control=='yinghun_true'){
					event.target.draw(player.maxHp-player.hp);
					event.target.chooseToDiscard(true,'he').ai=function(card){
						if(event.target.hasSkillTag('noe')){
							if(get.position(card)=='e'){
								if(player.num('h',{subtype:get.subtype(card)})) return 10; 
								if(get.subtype(card)=='equip1') return 8;
								if(get.subtype(card)=='equip2') return 6;
								if(get.subtype(card)=='equip3') return 4;
								if(get.subtype(card)=='equip4') return 10;
								if(get.subtype(card)=='equip5') return 0.1;
							}
							if(get.type(card)=='equip') return 0.1;
							return ai.get.disvalue(card)/2;
						}
					};
				}
				else{
					event.target.draw();
					event.target.chooseToDiscard(player.maxHp-player.hp,true,'he');
				}
			}
			lib.skill.wansha={
				audio:2,
				trigger:{global:'dying'},
				filter:function(event,player){
					return _status.currentPhase==player;
				},
				forced:true,
				priority:150,
				content:function(){
					lib.skill.global.push('wansha2');
				}
			}
			//------------------------------风----------------------------------//			
			lib.skill.buqu.ai={
				threaten:0.8
			}
			lib.skill.fenji.trigger={global:'loseAfter'};
			lib.skill.fenji.filter=function(event){
				if(_status.currentPhase!=event.player){
					if(event.getParent(2).name=='discardPlayerCard'||event.getParent().name=='gain'||event.getParent().name=='gainPlayerCard'){
						for(var i=0;i<event.cards.length;i++){
							if(event.cards[i].original=='h') return true;
						}
					}
				}
				return false;
			}
			lib.skill.fenji.prompt=function(event,player){
				return '是否对'+get.translation(event.player)+'发动【奋激】？';
			}
			lib.translate.fenji_info='当一名角色的手牌在其回合外被弃置或者被其它角色获得后，你可以失去一点体力，然后该橘色摸两张牌。';
			lib.skill.leiji.content=function(){
				"step 0";
				player.chooseTarget('是否发动【雷击】？').ai=function(target){
					if(ai.get.attitude(player,target)>=0) return -1;
					if(target.hasSkill('hongyan')) return -1;
					if(target.num('e','baiyin')) return ai.get.damageEffect(target,_status.event.player,_status.event.player,'thunder')/2;
					return ai.get.damageEffect(target,_status.event.player,_status.event.player,'thunder');
				}
				"step 1"
				if(result.bool){
					player.logSkill('leiji',result.targets,'thunder');
					event.target=result.targets[0];
					event.target.judge(function(card){
						if(get.suit(card)=='spade') return -4;
						return 0;
					})
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.bool==false){
					event.target.damage(2,'thunder');
				}
			}
			//------------------------------火----------------------------------//			
			lib.skill.tianyi.ai={
				order:function(name,player){
					var cards=player.get('h');
					if(player.num('h','sha')==0){
						return 1;
					}
					if(player.num('h','sha')>=2) return 9;
					for(var i=0;i<cards.length;i++){
						if(cards[i].name!='sha'&&cards[i].number>=10&&ai.get.value(cards[i])<7){
							return 9;
						}
					}
					return lib.card.sha.ai.order-1;
				},
				result:{
					player:function(player){
						if(player.num('h','sha')>0) return 0.6;
						var num=player.num('h');
						if(num>player.hp) return 0;
						if(num==1) return -2;
						if(num==2) return -1;
						return -0.7;
					},
					target:function(player,target){
						if(player.num('h','sha')>=2){
							var big=false;
							var cards=player.get('h');
							for(var i=0;i<cards.length;i++){
								if(cards[i].name!='sha'&&cards[i].number>=10){
									big=true;break;	
								}									
							}
							if(big==false) return target.num('h');
						}
						var num=target.num('h');
						return -10/target.num('h')+1;						
					},
				},
				threaten:1.3
			}
			lib.skill.luanji.check=function(card){
				if(card.name=='wanjian'||card.name=='nanman') return -1;
				var list=['jieming','yiji','shifei','wangxi','fangzhu'];
				for(var i=0;i<5;i++){
					if(get.skillOwner(list[i])!=0){
						var pl=get.skillOwner(list[i]);
						break;
					}
				}
				var player=_status.currentPhase;
				if(pl&&pl.hp>1&&player.isF(pl)){
					return 22-ai.get.value(card);
				}
				return 7-ai.get.value(card);
			}
			lib.skill.luanji.ai={
				order:function(skill,player){
					var pl=get.skillOwner('jieming');
					var player=_status.currentPhase;
					if(pl&&pl.hp>1&&pl.isF(player)&&player.isF(pl)){
						var num=0;
						var list2=['spade','diamond','club','heart'];
						for(var i=0;i<list2.length;i++){
							if(player.num('h',{suit:list2[i]})==2){
								if(player.num('h',function(card){
									return lib.filter.filterCard(card,player)&&get.suit(card)!=list2[i]
								})){
									return 1;
									break;
								}
								else num++;
							}
						}
						if(num==1) return 10;
						else return 1;
					}
					if(player.num('h','wuzhong')||player.num('h','yuanjiao')){
						return lib.card.wuzhong.ai.order-0.2;
					}
					return 10;
				},
				effect:{
					player:function(card,target,player,current){
						var pl=get.skillOwner('jieming');
						var player=_status.currentPhase;
						if(pl&&player.isF(pl)&&pl.isF(player)){
							var list3=['spade','diamond','club','heart'];
							var num;
							var suit;
							for(var i=0;i<list3.length;i++){
								if(player.num('h',{suit:list3[i]})==2){
									suit=list3[i];
									if(!num) num=0;
									num++;
								}
							}
							if(num==1){
								if(get.suit(card)==suit) return [0,-2];
								if(get.suit(card)!=suit&&card.name!='wuxie'&&card.name!='tao')return [1,3]
			}}}}}
			//------------------------------一将----------------------------------//
			lib.skill.luoying2.check=function(event,player){
				if(event.result.card.name=='du') return false;
				return true;
			}
			lib.skill.xinenyuan.content=function(){
				"step 0"
				player.line(trigger.source,'green');
				trigger.source.chooseCard('交给'+get.translation(player)+'一张手牌或流失一点体力').ai=function(card){
					if(ai.get.attitude(trigger.source,player)>0){
						return 11-ai.get.value(card);
					}
					else{
						if(trigger.source.hasSkill('zhaxiang')) return -1;
						return 7-ai.get.value(card);
					}
				};
				"step 1"
				if(result.bool){
					player.gain(result.cards[0]);
					trigger.source.$give(1,player);
				}
				else{
					trigger.source.loseHp();
				}
			}
			lib.skill.xinenyuan.check=function(event,player){
				var att=ai.get.attitude(player,event.source);
				var num=event.source.num('h');
				if(att==0)return true;
				if(att<0){
					if(event.source.hasSkill('zhaxiang')&&event.source.hp>1) return false;
				}
				if(num>2) return true;
				if(num) return att<4;
				return false;
			}
			lib.skill.shangshi.ai.threaten=function(player,target){
				if(target.maxHp>=4){
					if(target.hp==2) return 2;
					if(target.hp==1) return 3;
				}
				if(target.hp==1) return 2;
				return 0.7;
			}
			lib.skill.shangshi.ai.effect={
				player:function(card,player,target){
					if(_status.dying) return ;
					if(card.name=='tao') return ;
					if(_status.currentPhase!=player) return ;
					if(player.num('h')<=player.maxHp){
						if(player.num('h')-get.maxUse(player)<player.maxHp-player.hp) return [1,2]
					}
				},
				target:function(card,player,target){
					if(!target.hasFriend()) return;
					if(get.tag(card,'damage')==1){
						if(target.maxHp>=4){
							if(target.hp>=4) return [1,2];
							if(target.hp==3) return [1,1.2];
							if(target.hp==2) return [1,0.5];
						}
						else{
							if(target.hp==3) return [1,1.6];
							if(target.hp==2) return [1,0.5];
						}
					}
					if(get.tag(card,'recover')&&player.hp>=player.maxHp-1&&!_status.dying) return [0,0];
				}				
			}
			lib.skill.ganlu.ai.result.target=function(player,target){
				var list1=[];
				var list2=[];
				var num=player.maxHp-player.hp;
				for(var i=0;i<game.players.length;i++){
					if(ai.get.attitude(player,game.players[i])>0) list1.push(game.players[i]);
					else if(ai.get.attitude(player,game.players[i])<0) list2.push(game.players[i]);
				}
				list1.sort(function(a,b){
					return a.num('e')-b.num('e');
				});
				list2.sort(function(a,b){
					return b.num('e')-a.num('e');
				});
				var delta;
				for(var i=0;i<list1.length;i++){
					for(var j=0;j<list2.length;j++){
						delta=list2[j].num('e')-list1[i].num('e');
						if(delta<=0) continue;
						if(delta==1){
							if(list2[j].hasSkillTag('noe')) continue;
						}
						if(delta<=num){
							if(target==list1[i]||target==list2[j]){
								return (target.isDamaged()&&target.num('e','baiyin'))?2:0+ai.get.attitude(player,target);
							}
							return 0;
						}
					}
				}
				var pl1=get.skillOwner('xiaoji');
				var pl2=get.skillOwner('xuanfeng');				
				if(pl1||pl2){
					if(target.hasSkill('xiaoji')){
						if(ai.get.attitude(player,target)>0) return ai.get.attitude(player,target)+target.num('e')*2;
						return Math.abs(-ai.get.attitude(player,target)-target.num('e')*2);
					}
					if(target.hasSkill('xuanfeng')){
						if(ai.get.attitude(player,target)>0) return ai.get.attitude(player,target)+2;
						return Math.abs(-ai.get.attitude(player,target)-2);
					}
					if(ai.get.attitude(player,target)>0){
						if(target.isDamaged()&&target.num('e','baiyin')) return ai.get.attitude(player,target)+1.5;
						return ai.get.attitude(player,target);
					}
					else return 0;
				}
				return 0;
			}
			lib.skill.xinjujian.content=function(){
				"step 0"
				player.chooseCardTarget({
					filterTarget:function(card,player,target){
						return player!=target;
					},
					filterCard:function(card){
						return get.type(card)!='basic';
					},
					ai1:function(card){
						if(get.tag(card,'damage')&&get.type(card)=='trick'){
							return 20;
						}
						return 9-ai.get.value(card);
					},
					ai2:function(target){
						var eff=ai.get.gainEffect(player,target);
						if(eff>0){
							if(target.isTurnedOver()) eff+=3;
							if(target.hp==1) eff+=4;
						}
						return eff;
					},
					position:'he',
					prompt:'是否发动【举荐】？'
				});
				"step 1"
				if(result.bool){
					var target=result.targets[0];
					event.target=target;
					player.logSkill('xinjujian',target);
					player.discard(result.cards);
					if(target.hp==target.maxHp&&
						!target.isTurnedOver()&&
						!target.isLinked()){
						target.draw(2);
						event.finish();
					}
					else{
						var controls=['draw_card'];
						if(target.hp<target.maxHp){
							controls.push('recover_hp');
						}
						if(target.isLinked()|target.isTurnedOver()){
							controls.push('reset_character');
						}
						target.chooseControl(controls).ai=function(){
							if(target.isTurnedOver()){
								return 'reset_character';
							}
							else if(target.hp==1&&target.maxHp>2){
								return 'recover_hp';
							}
							else if(target.hp==2&&target.maxHp>2&&target.num('h')>1){
								return 'recover_hp';
							}
							else{
								return 'draw_card';
							}
						}
					}
				}
				else{
					event.finish();
				}
				"step 2"
				event.control=result.control;
				switch(event.control){
					case 'recover_hp':event.target.recover();event.finish();break;
					case 'draw_card':event.target.draw(2);event.finish();break;
					case 'reset_character':if(event.target.isTurnedOver()) event.target.turnOver();break;
				}
				"step 3"
				if(event.control=='reset_character'&&event.target.isLinked()){
					event.target.link();
				}
			}
			lib.skill.mingce.content=function(){
				"step 0"
				targets[0].gain(cards);
				game.delay(2);
				"step 1"
				var next=targets[0].chooseControl('draw_card','出杀').ai=function(){
					if(ai.get.effect(targets[1],{name:'sha'},targets[0])>0) return 1;
					return 0;
				}
				next.prompt='对'+get.translation(targets[1])+'使用一张杀，或摸一张牌';
				"step 2"
				if(result.control=='draw_card'){
					targets[0].draw();
				}
				else{
					targets[0].useCard({name:'sha'},targets[1]);
				}
			}
			lib.skill.mingce.ai.result.target=function(player,target){
				if(ui.selected.targets.length){
					return -1;
				}
				if(ui.selected.cards[0]&&get.type(ui.selected.cards[0])=='equip'){
					if(target.hasSkillTag('noe')) return 4;
				}				
				var eff=[];
				var ca=0;
				var caa;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i]==player) continue;
					if(game.players[i].isF(player)){
						var cc=get.maxShaEffect(game.players[i]);
						if(cc){
							var e=ai.get.effect(cc,{name:'sha'},player);
							eff.push([e,game.players[i]]);
						}
					}
				}
				for(var i=0;i<eff.length;i++){
					if(eff[i][0]>ca){
						ca=eff[i][0];
						caa=eff[i][1];
					} 
				}
				if(!target.hasCardTarget('sha')) return 0.4;
				if(target.hasSkill('reluoyi2')) return 10;
				if(target.hasSkill('retieji')) return 6;
				if(target.hasSkill('xinpojun')) return 5;
				if(target.hasSkill('lieren')) return 3;
				if(target==caa) return 3;
				return 1;	
			}
			//------------------------------二将----------------------------------//
			lib.skill.gongji.content=function(){
				"step 0"
				player.addTempSkill('gongji2','phaseAfter');
				"step 1"
				if(get.type(cards[0])=='equip'){
					player.chooseTarget('是否弃置一名角色的一张牌？',function(card,player,target){
						return player!=target&&target.num('he')>0;
					}).ai=function(target){
						if(ai.get.attitude(player,target)<0){
							return Math.max(0.5,ai.get.effect(target,{name:'sha'},player,player));
						}
						return 0;
					}
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.bool){
					player.line(result.targets[0],'green');
					event.target=result.targets[0];
					player.discardPlayerCard(event.target,'he',true).ai=ai.get.buttonValue;
				}
			}
			lib.skill.zishou.check=function(event,player){
				var pl1=get.skillOwner('dimeng');
				var pl2=get.skillOwner('lihun');
				var pl3=get.skillOwner('guzheng');
				if((pl1&&pl1.isE(player))||(pl2&&pl2.isE(player))){
					if((player.num('e')&&player.num('h')>=2)||(!player.num('e')&&player.num('h')>=3)) return 0;
				}
				if(get.maxUse(player)<=1) return 1;
				if(pl3&&pl3.isF(player)&&!pl3.num('j','lebu')) return 1;
				return player.num('h')<=player.maxHp||player.skipList.contains('phaseUse');
			}
			lib.skill.random={
				trigger:{player:'phaseBegin'},
				forced:true,
				popup:false,
				silent:true,
				content:function(){
					player.storage.random=Math.random();
				}
			}
			if(lib.character.xunyou) lib.character.xunyou[3].push('random');
			if(lib.character.guohuanghou) lib.character.guohuanghou[3].push('random');
			lib.skill.qice.chooseButton.check=function(button){
				var player=_status.currentPhase;
				var nanman=0;
				var wanjian=0;
				var taoyuan=0; 
				var random=player.storage.random;
				for(var i=0;i<game.players.length;i++){
					if(!lib.filter.filterTarget({name:'nanman'},player,game.players[i])){
						continue;
					}
					nanman+=ai.get.effect(game.players[i],{name:'nanman'},player);
					wanjian+=ai.get.effect(game.players[i],{name:'wanjian'},player);
				}
				for(var i=0;i<game.players.length;i++){
					if(!lib.filter.filterTarget({name:'taoyuan'},player,game.players[i])){
						continue;
					}
					taoyuan+=ai.get.effect(game.players[i],{name:'taoyuan'},player);
				}
				if((nanman>taoyuan||wanjian>taoyuan)&&(nanman>6||wanjian>6)){
					if(nanman==wanjian){
						return (button.link[2]=='wanjian')?1:-1;
					}
					else if(nanman>wanjian) return (button.link[2]=='nanman')?1:-1;
					else return (button.link[2]=='wanjian')?1:-1;
				}
				if(taoyuan>=10) return (button.link[2]=='taoyuan')?1:-1;
				var list=['shunshou','guohe','wuzhong'];
				if(get.mostDamage(player)&&get.mostDamage(player).num('h')<=2) list.push('juedou');				
				if(!player.hasCardTarget('shunshou')) list.remove('shunshou');
				if(random<0.5&&list.contains('shunshou')) return (button.link[2]=='shunshou')?1:-1;
				if(random>0.7) return (button.link[2]=='wuzhong')?1:-1;
				if(random<0.35) return (button.link[2]=='guohe')?1:-1;
				if(list.contains('juedou')) return (button.link[2]=='juedou')?1:-1;
				return (button.link[2]=='wuzhong')?1:-1;
			}
			lib.skill.qice.ai={
				order:1,
				threaten:1.6,
				result:{
					player:function(player,target){
						var num=0;
						var cards=player.get('h');						
						for(var i=0;i<cards.length;i++){
							num+=Math.max(0,ai.get.value(cards[i],player,'raw'));
						}
						num/=cards.length;
						num*=Math.min(cards.length,player.hp);
						return 13.5-num;
					}
				},
				effect:{
					player:function(card,player,target){
						if(_status.currentPhase!=player) return ;
						if(_status.dying) return ;
						if(card.name=='tao'){
							var cards=player.get('h');
							if(cards.length>=3&&player.hp>=3) return ;						
							return [1,3];
						}
					}
				}
			}
			lib.skill.zhiyu.ai.effect=function(card,player,target){
				if(player.hasSkill('jueqing')) return [1,-2];
				if(get.tag(card,'damage')){
					if(target.num('h')==0&&player.num('h')<=player.hp) return [0,-1,1,-1];
				}
			}
			lib.skill.miji.ai.effect.target=function(card,player,target){
				if(!target.hasFriend()) return ;
				if(get.tag(card,'damage')){
					if(!target.hasFriend()) return;
					if(get.tag(card,'damage')){
						if(target.maxHp-target.hp==0) return [1,2];
						if(target.maxHp-target.hp==1) return [1,0.7];
						if(target.maxHp-target.hp==2) return [1,0.4];
					}
				}
				if(get.tag(card,'recover')&&player.hp>=player.maxHp-1&&_status.currentPhase==player) return [0,0];
			}
			lib.skill.miji.frequent=true;
			lib.skill.miji.content=function(){
				"step 0"
				event.num=player.maxHp-player.hp;
				player.draw(event.num);
				"step 1"
				var check=player.num('h')-event.num;
				player.chooseCardTarget({
					selectCard:event.num,
					filterTarget:function(card,player,target){
						return player!=target;
					},
					ai1:function(card){
						if(check<1) return 0;
						if(player.hp>1&&check<2) return 0;
						return ai.get.unuseful(card)+9;
					},
					ai2:function(target){
						return ai.get.gainEffect(player,target);
					},
					prompt:'将'+get.cnNumber(event.num)+'张手牌交给一名其他角色',
				});
				"step 2"
				if(result.bool){
					result.targets[0].gain(result.cards);
					event.player.$give(result.cards.length,result.targets[0]);
				}
			}
			lib.skill.zili.audio=2
			lib.skill.paiyi.ai.result.target=function(player,target){
				if(player.num('h')+2>player.hp+player.storage.quanji.length) return 0;
				if(player==target) return 13;
				else{
					if(target.num('h')+2>player.num('h')&&ai.get.damageEffect(target,player)<0)
					return 0;
					return ai.get.gainEffect(player,target);
				}
			}
			lib.skill.xuanfeng.content=function(){
				"step 0"
				if(!event.num) event.num=2;
				player.chooseTarget('请选择旋风的目标',function(card,player,target){
					if(player==target) return false;
					return target.num('he');
				}).ai=function(target){
					return ai.get.disEffect(player,target);
				};
				"step 1"
				if(result.bool){
					event.target=result.targets[0];
					player.logSkill('xuanfeng',result.targets);
					player.discardPlayerCard(result.targets[0],'he',true);
				}
				else{
					event.finish();
				}
				'step 2'
				event.num--;
				if(_status.event.parent.parent.name=='phaseDiscard') trigger.cards.push(result.links[0]);
				game.delay();
				if(event.num) event.goto(0);
			}
			lib.skill.xuanfeng.ai.effect.player=function(card,player,target,current){
				if(_status.currentPhase!=player) return;
				var pl=get.skillOwner('guzheng');						
				if(pl&&ai.get.attitude(player,pl)>=0.5){
					if(player.num('h')==player.hp+2) return [0,0,0,0];
				}					
			}
			lib.skill.lihuo.check=function(card){
				var player=_status.currentPhase;
				var num=game.countPlayer(function(target){
					return target.isE(player)&&player.canUse('sha',target)&&ai.get.effect(target,{name:'sha'},player)>0;
				});
				if(num<2) return 0;
				return 10-ai.get.value(card);
			}
			lib.skill.lihuo.ai={
				order:4.2
			}
			delete lib.skill.lihuo.usable
			//------------------------------三将----------------------------------//
			if(lib.character.jianyong) lib.character.jianyong[3]=['qiaoshui'];
			lib.skill.qiaoshui={
				audio:2,
				trigger:{player:'phaseUseBegin'},
				direct:true,
				filter:function(event,player){
					return player.num('h')>0;
				},
				content:function(){
					"step 0"
					player.chooseTarget('是否发动【巧说】？',function(card,player,target){
						return player!=target&&target.num('h')>0;
					}).ai=function(target){
						return -ai.get.attitude(player,target)/target.num('h');
					}
					"step 1"
					if(result.bool){
						player.logSkill('qiaoshui',result.targets[0]);
						player.chooseToCompare(result.targets[0]);
					}
					else{
						event.finish();
					}
					"step 2"
					if(result.bool){
						player.gain(result.target,'gain2');
						player.addTempSkill('qiaoshui3','phaseAfter');
					}
					else{
						player.gain(result.player,'gain2');
						player.addTempSkill('qiaoshui2','phaseAfter');
					}
				},
				ai:{
					expose:0.1
				}
			}
			lib.skill.qiaoshui3={
				trigger:{player:'useCard'},
				frequent:true,
				filter:function(event,player){
					if(_status.currentPhase!=player) return false;
					if(player.hasSkill('shibei2')) return false;
					var card=event.card;
					if(get.type(card)=='basic'||get.type(card)=='trick') return true;
					return false;
				},
				content:function(){
					"step 0"
					player.addTempSkill('shibei2','phaseEnd');
					var controls=['增加一个目标','减少一个目标'];
					var list=['nanman','wanjian','taoyuan','wugu'];
					if(list.contains(trigger.card.name)){
						event.control='减少一个目标';
					}
					if(trigger.targets.length==1){
						event.control='增加一个目标';
					}
					if(!event.control) player.chooseControl(controls,true);
					'step 1'
					if(result.control) event.control=result.control;
					player.chooseTarget('请选择'+get.translation(trigger.card)+'的额外目标或者减少的目标',function(card,player,target){
					if(trigger.targets.length==1){
						return trigger.targets.contains(target)==false;
					}
					return target!=player;
					}).ai=function(target){
						switch(trigger.card.name){
							case 'nanman':return -ai.get.effect(target,trigger.card,player);
							break;
							case 'wanjian':return -ai.get.effect(target,trigger.card,player);
							break;
							case 'wuzhong': return ai.get.gainEffect(player,target);
							break;
							case 'wugu': return -ai.get.attitude(player,target);
							break;
							default: return ai.get.effect(target,trigger.card,player);
						}
					}
					"step 2"
					if(result.bool){
						player.line(result.targets[0]);
						game.delay();
						event.target=result.targets[0];
						if(event.control=='增加一个目标'){
							game.log(event.target,'成为了',trigger.card,'的额外目标');
							trigger.targets.push(event.target);
						}
						if(event.control=='减少一个目标'){
							game.log(event.target,'取消了成为',trigger.card,'的目标');
							trigger.targets.remove(event.target);
						}
					}
				}
			}
			lib.translate.qiaoshui_info='出牌阶段开始时,你可与一名角色拼点.若你赢,则你的下一张基本牌或者非延时锦囊可以额外增加一个目标(无距离限制);或者减少一个目标,若你没赢,则你本回合不能使用锦囊'
			lib.skill.junxing.content=function(){
				"step 0"
				if(!target.num('h')){
					target.turnOver();
					target.draw(cards.length);
					event.finish();
				}
				'step 1'
				var types=[];
				for(var i=0;i<cards.length;i++){
					types.add(get.type(cards[i],'trick'));
				}
				var dialog=ui.create.dialog('弃置一张与'+get.translation(player)+'弃置的牌类别均不同的牌,或将武将牌翻面','hidden');
				dialog.classList.add('noselect');
				dialog.add(cards);
				target.chooseToDiscard(dialog,function(card){
					return !types.contains(get.type(card,'trick'));
				}).ai=function(card){
					if(target.isTurnedOver()) return -1;
					return 8-ai.get.value(card);
				};
				"step 2"
				if(!result.bool){
					target.turnOver();
					target.draw(cards.length);
				}
			}
			lib.skill.junxing.ai.order=function(skill,player){
				if(player.num('h')<=2&&player.num('e','fangtian')&&player.num('h','sha')) return 4.2;
			}
			lib.skill.yuce.content=function(){
				"step 0"
				player.chooseCard('是否发动御策？').ai=function(card){
					return get.type(card)=='basic'?2:1;
				}
				"step 1"
				if(result.bool){
					player.logSkill('yuce');
					player.$throw(result.cards[0],'highlight');
					game.delay(1);
					var type=get.type(result.cards[0],'trick');
					if(trigger.source){
						trigger.source.chooseToDiscard('弃置一张不是'+get.translation(type)+'牌的牌或令'+get.translation(player)+'回复一点体力',function(card){
							return get.type(card,'trick')!=type;
						}).ai=function(card){
							if(ai.get.recoverEffect(player,trigger.source,trigger.source)<0){
								return 7-ai.get.value(card);
							}
							return 0;
						}
					}
					else{
						event.recover=true;
					}
				}
				else{
					event.finish();
				}
				"step 2"
				if(event.recover){
					player.recover();
				}
				if(!result.bool){
					player.recover();
				}
			}
			lib.skill.yuce.ai={
				maixie:true,
				threaten:function(player,target){
					if(target.num('h')==0) return 1.7;
					return 0.9;
				},
				effect:{
					target:function(card,player,target,current){
						if(!target.num('h')) return ;
						if(player.num('h','jiu')||player.hasSkill('jiu')) return ;
						if(target.hp==1) return ;
						if(get.tag(card,'damage')){
							if(ai.get.attitude(player,target)>=0&&_status.currentPhase!=target) return 0;
							if(player.num('h')<=2) return 0;
							if(!player.num('h',function(card){
								return card.name!='wuzhong'&&card.name!='yuanjiao'&&card.name!='shunshou'&&get.type(card)!='basic'
							})) return 0;
							return 0.6;
						}
					}
				}				
			}
			lib.translate.yuce_info='当你受到一次伤害后,你可以展示一张手牌,伤害来源须选择弃置一张与此牌类型不同的手牌,否则你回复一点体力'
			lib.skill.xinmieji={
				audio:['mieji',2],
				enable:'phaseUse',
				usable:1,
				discard:false,
				filterTarget:function(card,player,target){
					return target.num('h')>0&&target!=player;
				},
				filterCard:function(card){
					return get.type(card,'trick')=='trick'&&get.color(card)=='black';
				},
				check:function(card){
					return 6-ai.get.value(card);
				},
				content:function(){
					'step 0'
					game.log(player,'将',cards[0],'置于牌堆顶');
					ui.cardPile.insertBefore(cards[0],ui.cardPile.firstChild);
					'step 1'
					target.chooseToDiscard('弃置一张锦囊牌或者弃置两张非锦囊牌','he',true,function(card){
						if(!target.num('h',{type:'basic'})&&player.num('h',{type:'trick'})){
							return get.type(card,'trick')=='trick';
						}
						if(player.hasSkill('shibei2')){
							return get.type(card,'trick')!='trick';
						}
						return true;
					})
					'step 2'
					if(get.type(result.cards[0],'trick')!='trick'&&!player.hasSkill('shibei2')){
						player.addTempSkill('shibei2','phaseEnd');
						event.goto(1);
					}
				},
				ai:{
					order:6.1,
					expose:0.3,
					result:{
						target:function(player,target){
							if(target.num('he')==1) return 0;
							return -1/(target.num('he')+1);
						}
					},
					effect:{
						player:function(card,player){
							if(_status.currentPhase!=player) return;
							if(player.num('h','guohe')<=1&&card.name=='guohe'&&get.color(card)=='black') return[0,0,0,0];
						}	
					}
				}	
			}
			lib.skill.xinfencheng={
				skillAnimation:'epic',
				animationColor:'fire',
				audio:['fencheng',2],
				enable:'phaseUse',
				filter:function(event,player){
					return !player.storage.fencheng;
				},
				unique:true,
				mark:true,
				prepare:function(cards,player){
					player.line(game.players,'fire');
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=player){
							game.players[i].animate('target');
						}
					}
				},
				content:function(){
					'step 0'
					player.storage.fencheng=true;
					player.unmarkSkill('xinfencheng');
					event.num=1;
					event.current=player.next;
					'step 1'
					var e=event.current;
					var en=event.current.next;
					var res=ai.get.damageEffect(en,e,e,'fire');
					var list=['quanji','guixin','yiji','reyiji','shangshi','huituo'];
					if(e.num('he')>=event.num){
					e.chooseToDiscard([event.num,e.num('he')],'he','请弃置至少'+get.cnNumber(event.num)+'张牌否则受到2点火焰伤害').ai=function(card){
						if(res<0){
							if(ui.selected.cards.length>event.num-1) return 0;
							if(e.hp>=3){
								if(en.hp<=1&&en.num('h')<event.num+2) return -1;
								if(event.num>=3) return -1;
							}
							
						}
						else{
							if(en==player){
								if(ui.selected.cards.length>event.num-1) return 0;
							}
							else{
								if(en.num('h')<event.num+2){
									if(en.hp==2&&!en.isLinked()){
										if(ui.selected.cards.length>en.num('h')-1) return 0;
									}
									else if(en.hp==1||en.isLinked()){
										if(ui.selected.cards.length>en.num('he')-1) return 0;
									}
									else{
										if(ui.selected.cards.length>event.num-1) return 0;
									}
								}
								else{
									if(e.hp>=3&&event.num>=3){
										for(var i=0;i<list.length;i++){
											if(e.hasSkill(list[i])) return -1;
										}
										if(ui.selected.cards.length>event.num-1) return 0;
									}
									else{
										if(ui.selected.cards.length>event.num-1) return 0;
									}
								}							
							}
						}					
						return 9-ai.get.value(card);
					}}
					else{
						delete result.cards;
					}
					'step 2'
					if(event.current.isAlive()){
						if(result.cards){
							event.num=result.cards.length+1;
						}					
						else{
							event.num=1;
							event.current.damage(2,'fire');
							delete result.cards;
						}
					}
					else{
						event.num=1;
					}
					'step 3'
					if(event.current.next!=player){
						event.current=event.current.next;
						game.delay(0.5);
						event.goto(1);
					}
				},
				ai:{
					order:2,
					result:{
						player:function(player){
							var num=0;
							for(var i=0;i<game.players.length;i++){
								if(lib.config.mode=='identity'&&player.identity=='fan'){
									if(game.zhu.hp<=2&&game.zhu.num('he')<=1) return 10;
								}
								if(game.players[i]==player) continue;
								var att=ai.get.attitude(player,game.players[i]);
								if(game.players[i].num('he')<=2&&game.players[i].hp<=2){
									if(att<=0){
										if(game.players[i].isLinked()){
											num++;
										}
										num+=2/(game.players[i].num('he')+1);
									}
									if(att>0){
										num-=2/(game.players[i].num('he')+1);
									}
								}
							}
							return num-1;
						}
					}
				},
				init:function(player){
					player.storage.fencheng=false;
				},
				intro:{
					content:'limited'
				}
			}
			lib.skill.chengxiang.content=function(){
				"step 0"
				event.cards=get.cards(4);
				event.videoId=lib.status.videoId++;
				game.broadcastAll(function(player,id,cards){
					var str;
					if(player==game.me&&!_status.auto){
						str='称象：选择任意张点数小于13的牌';
					}
					else{
						str='称象';
					}
					var dialog=ui.create.dialog(str,cards);
					event.dialog=dialog;
					dialog.videoId=id;
				},player,event.videoId,event.cards);
				event.time=get.utc();
				game.addVideo('showCards',player,['称象',get.cardsInfo(event.cards)]);
				game.addVideo('delay',null,2);
				"step 1"
				var next=player.chooseButton([0,4]);
				next.set('dialog',event.videoId);
				next.set('filterButton',function(button){
					var num=0
					for(var i=0;i<ui.selected.buttons.length;i++){
						num+=get.number(ui.selected.buttons[i].link);
					}
					return (num+get.number(button.link)<=13);
				});
				next.set('ai',function(button){
					var list=[];
					for(var i=0;i<4;i++){
						list.push(event.dialog.buttons[i].link);
					}
					list.sort(function(a,b){
						return get.number(b)-get.number(a)
					})
					if(get.number(list[3])+get.number(list[2])>13){
						return ai.get.value(button.link,_status.event.player);
					}
					for(var i=0;i<4;i++){
						if(list[i]==button.link) return i+ai.get.value(button.link,_status.event.player)/3;
					}
				});
				"step 2"
				if(result.bool&&result.links){
					player.logSkill('chengxiang');
					var cards2=[];
					for(var i=0;i<result.links.length;i++){
						cards2.push(result.links[i]);
						cards.remove(result.links[i]);
					}
					for(var i=0;i<cards.length;i++){
						ui.discardPile.appendChild(cards[i]);
					}
					event.cards2=cards2;
				}
				else{
					event.finish();
				}
				var time=1000-(get.utc()-event.time);
				if(time>0){
					game.delay(0,time);
				}
				"step 3"
				game.broadcastAll('closeDialog',event.videoId);
				var cards2=event.cards2;
				player.gain(cards2);
				player.$draw(cards2);
				game.log(player,'获得了',cards2)
				game.delay(2);
			}
			lib.skill.xiansi.content=function(){
				"step 0"
				player.chooseTarget('是否发动陷嗣？',[1,2],function(card,player,target){
					return target.num('he')>0;
				},function(target){
					return ai.get.disEffect(_status.event.player,target);
				});
				"step 1"
				if(result.bool){
					player.logSkill('xiansi',result.targets);
					event.targets=result.targets;
				}
				else{
					event.finish();
				}
				"step 2"
				if(event.targets.length){
					var target=event.targets.shift();
					event.current=target;
					player.choosePlayerCard(target,true).ai=function(button){
						if(get.subtype(button)=='equip3') return 10;
						if(get.subtype(button)=='equip1') return 8;
						if(get.subtype(button)=='equip2') return 7;
						return ai.get.buttonValue(button);
					}
				}
				else{
					event.finish();
				}
				"step 3"
				if(result.bool){
					player.markSkill('xiansi');
					player.storage.xiansi=player.storage.xiansi.concat(result.links);
					player.updateMarks();
					event.current.lose(result.links,ui.special);
					event.current.$give(result.links,player);
					event.goto(2);
				}
			}
			lib.skill.zhuikong.check=function(event,player){
				if(event.player.num('j','lebu')) return 0;
				if(ai.get.attitude(player,event.player)<-2){
					var cards=player.get('h');
					if(cards.length>player.hp) return true;
					for(var i=0;i<cards.length;i++){
						var useful=ai.get.useful(cards[i]);
						if(useful<5) return true;
						if(cards[i].number>9&&useful<7) return true;
					}
				}
				return false;
			}
			lib.skill.longyin.content=function(){
				'step 0'
				var go=false;
				if(ai.get.attitude(player,trigger.player)>0){
					if(get.color(trigger.card)=='red'){
						go=true;
					}
					else if(!trigger.player.hasSkill('paoxiao')&&
						!trigger.player.hasSkill('tanlnin3')&&
						!trigger.player.hasSkill('zhaxiang2')&&
						!trigger.player.hasSkill('fengnu')&&
						!trigger.player.num('e','zhuge')){
						var nh=trigger.player.num('h');
						if(player==trigger.player){
							go=(player.num('h','sha')>0);
						}
						else if(nh>=4){
							go=true;
						}
						else if(player.num('h','sha')){
							if(nh==3){
								go=Math.random()<0.8;
							}
							else if(nh==2){
								go=Math.random()<0.5;
							}
						}
						else if(nh>=3){
							if(nh==3){
								go=Math.random()<0.5;
							}
							else if(nh==2){
								go=Math.random()<0.2;
							}
						}
					}
				}
				var next=player.chooseToDiscard('是否发动【龙吟】？','he');
				next.ai=function(card){
					if(go){
						if(player=_status.currentPhase){
							var num=0;
							var num2=0;
							if(get.color(card)=='red'&&card.name=='sha') num--;
							if(player.num('h','sha')==1&&card.name=='sha') num2-=2;
							return 6-ai.get.value(card)+num+num2;
						}
						return 6-ai.get.value(card);
					}
					return 0;
				}
				next.logSkill=['longyin',trigger.player];
				'step 1'
				if(result.bool){
					trigger.player.getStat().card.sha--;
					if(get.color(trigger.card)=='red'){
						player.draw();
					}
				}
			}
			lib.skill.jingce.ai={
				effect:{
					player:function(card,player,target){
						if(_status.currentPhase!=player) return;
						if(get.maxUse(player)<player.hp) return;
						if(get.cardCount(true,player)<player.hp){
							return [1,2]
						}
					}
				}
			}
			lib.skill.zongxuan.content=function(){
				"step 0"
				var cards=[];
				for(var i=0;i<trigger.cards.length;i++){
					if(get.position(trigger.cards[i])=='d'){
						cards.push(trigger.cards[i]);
					}
				}
				player.chooseCardButton(cards,[1,cards.length],'是否发动【纵玄】？').ai=function(button){
					if(_status.currentPhase!=player) return -1;
					if(get.type(button.link)=='equip'||ai.get.value(button.link)>=7) return 10;
					return -1;
				}
				"step 1"
				if(result&&result.bool&&result.buttons&&result.buttons.length){
					var cards=result.links.slice(0);
					while(cards.length){
						ui.cardPile.insertBefore(cards.pop(),ui.cardPile.firstChild);
					}
					player.logSkill('zongxuan');
					game.log(player,'将',cards,'置于牌堆顶');
					game.delay(1);
				}
			}
			lib.skill.zhiyan.content=function(){
				"step 0"
				player.chooseTarget('是否发动【直言】？').ai=function(target){
					if(player.getStat().skill.zongxuan) return ai.get.recoverEffect(player,target)
					return ai.get.gainEffect(player,target);
				}
				"step 1"
				if(result.bool){
					event.target=result.targets[0];
					player.logSkill('zhiyan',result.targets[0]);
				}
				else{
					event.finish();
				}
				"step 2"
				var cards=get.cards();
				var card=cards[0];
				switch(get.type(card,'trick')){
					case 'basic':event.effect='';break;
					case 'trick':event.effect='';break;
					case 'equip':event.effect='recover';break;
				}
				if(get.type(card)=='equip'){
					event.target.gain(card,'gain2');
					event.target.equip(card);
				}
				else{
					event.target.gain(cards,'gain2');
					game.log(event.target,'获得了',card);
				}
				"step 3"
				switch(event.effect){
					case 'recover':event.target.recover();break;
				}
			}
			lib.skill.zhiyan.ai.effect={
				player:function(card,target,player,current){
					if(player!=_status.currentPhase) return;
					var num=0;				
					for(var i=0;i<game.players.length;i++){
						var pl=game.players[i];
						if(pl.isF(player)&&pl.isDamaged()) num++;
					}
					if(num>0){
						if(player.num('h')<=player.hp+1&&player.num('h',{type:'equip'})) return [0,0,0,0]
						if(get.type(card)=='equip'&&player.num('h',{type:'equip'})<=1) return [0,0,0,0]
					}
				}
			}
			lib.skill.anjian.ai={
				effect:{
					player:function(card,player,target){
						if(card.name=='sha'&&get.distance(target,player,'attack')>1) return [1,0,1,-1]
					}
				}
			}
			//------------------------------四将----------------------------------//
			delete lib.skill.benxi.popup
			delete lib.skill.benxi.silent
			lib.skill.benxi.audio=['benxi',2]
			lib.skill.jianying.ai={
				effect:{
					player:function(card,player,target){								
						if(_status.currentPhase!=player) return;
						if(!player.storage.jianying) return ;
						if(lib.filter.filterCard(card,player)){
							if(get.subtype(card)=='equip1'&&player.num('e','zhuge')&&player.num('h')>=5) return [0,0,0,0];
							if(get.suit(card)==get.suit(player.storage.jianying)) return [1,3];
							if(card.number==player.storage.jianying.number) return [1,2];
							if(player.num('h',function(card){
								return get.suit(card)==get.suit(player.storage.jianying)&&player.hasCardTarget(card);
							})){
								if(card.name=='zhuge') return ;
								if(get.suit(card)!=get.suit(player.storage.jianying)) return [0,0,0,0];
							}
						}
					}
				}
			}
			lib.skill.shibei.content=function(){
				if(!player.hasSkill('shibei2')){
					player.recover();
				}
				else{
					player.loseHp();
				}
				player.addTempSkill('shibei2','phaseAfter');
			}
			lib.skill.shibei.ai={
				threaten:function(player,target){
					if(!target.hasSkill('shibei2')) return 0.5;
					return 2;
				},
				effect:{
					target:function(card,player,target){
						if(target.hp==1) return ;
						if(player.num('h','jiu')||player.hasSkill('jiu')) return ;
						var list=['paoxiao','zhuge_skill','qiangwu','zhaxiang','shuangxiong'];
						if(get.tag(card,'damage')){
							if(target.hasSkill('shibei2')) return 2;
							if(ai.get.attitude(player,target)>=0&&_status.currentPhase!=target) return 0;
							for(var i=0;i<list.length;i++){
								if(player.hasSkill(list[i])) return [1,-2];
							}
							var num=player.num('h','sha')>0?1:0;
							if(player.num('h',function(card){
								return get.tag(card,'damage')&&card.name!='sha';
							})+num<=2&&player.num('h')<=4) return 0;
						}
					}
				}
			}
			lib.translate.shibei_info='锁定技,当你受到一次伤害后,若此伤害为你本回合受到的第一次伤害,你回复一点体力,否则你失去一点体力'
			lib.skill.shenxing.check=function(card){
				var player=_status.currentPhase;
				var cards=player.get('h');
				var color=get.color(cards[0]);
				var same=true;					
				for(var i=1;i<cards.length;i++){
					if(get.color(cards[i])!=color) same=false;
				}
				if(!same&&cards.length>=player.hp){
					var num=player.num('h',{color:'red'});
					if(get.color(card)=='black'&&num>=2) return num;
				}
				return 4-ai.get.useful(card);
			}
			lib.skill.shenxing.ai.result={
				player:function(player,target){
					if(player.num('h')>=player.hp+2) return 1;
					return 0;
				}
			}
			lib.skill.bingyi.content=function(){
				"step 0"
				player.showHandcards();
				"step 1"
				var num=player.num('h');
				player.chooseTarget('选择至多'+num+'名角色各摸一张牌',[1,num],function(card,player,target){
					return true;
				}).ai=function(target){
					return ai.get.gainEffect(player,target);
				}
				"step 2"
				if(result.bool){
					event.num=0;
					event.targets=result.targets;
					game.log(player,'对',result.targets,'发动了【秉壹】');
					game.asyncDraw(result.targets);
				}
			}
			lib.skill.bingyi.ai.effect={
				player:function(card,target,player){
					if(player!=_status.currentPhase) return ;
					if(_status.dying) return ;
					if(card.name=='lebu'||card.name=='bingliang') return ;
					var cards=player.get('h');
					var color=get.color(cards[0]);
					var same=true;					
					for(var i=1;i<cards.length;i++){
						if(get.color(cards[i])!=color) same=false;
					}
					if(same&&player.num('h')<=player.hp) return [1,-1];
					if(!same&&cards.length<=4){
						var num=player.num('h',{color:'red'});
						if(num<=player.hp){
							if(get.color(card)=='red'&&card.name!='wuzhong'&&card.name!='yuanjiao'&&card.name!='shunshou') return [1,-1]
						}
						if(get.color(card)=='black'&&num>=2) return [1,num];
					}
				}
			}
			lib.skill.xiantu.check=function(event,player){
				if(game.phaseNumber==1) return false;
				if(ai.get.attitude(player,event.player)<3) return false;
				if(player.num('e','baiyin')) return true;
				if(!event.player.hasCardTarget('sha')) return false;
				if(player.maxHp-player.hp>=2) return false;
				if(player.hp==1) return false;
				if(player.hp==2&&player.num('h')<3) return false;
				if(event.player.num('h')>=event.player.hp+3) return false;
				return true;
			}
			lib.skill.qiangzhi.content=function(){
				'step 0'
				player.chooseTarget('是否发动【强识】？',function(card,player,target){
					return target!=player&&target.num('h')>0;
				}).ai=function(target){
					return -ai.get.attitude(player,target)+1;
				}
				'step 1'
				if(result.bool){
					var target=result.targets[0];
					player.logSkill('qiangzhi',target);
					var card=target.get('h').randomGet();
					player.showCards(card);
					player.storage.qiangzhi=get.type(card,'trick');
					game.addVideo('storage',player,['qiangzhi',player.storage.qiangzhi]);
					player.markSkill('qiangzhi');
				}
			}
			lib.skill.dingpin.ai.result.target=function(player,target){
				if(player.isTurnedOver()) return 1;
				return target.maxHp-target.hp-1;			
			}
			delete lib.skill.qieting.frequent
			lib.skill.qieting.direct=true
			lib.skill.qieting.content=function(){
				"step 0"
				if(trigger.player.num('e')){
					var next=player.chooseCardButton(trigger.player.get('e'),'选择装备一张装备牌,或摸一张牌')
					next.filterButton=function(button){
						return !player.get('e',get.subtype(button.link)[5])
					}
					next.ai=function(button){
						if(ai.get.attitude(player,trigger.player)>0){
							if(trigger.player.hp==1&&trigger.player.num('e','baiyin')){
								return button.link.name=='baiyin'?1:0;
							}
							return 0;
						} 
						return ai.get.value(button)
					}
				}
				"step 1"
				player.logSkill('qieting');
				if(result&&result.buttons&&result.buttons.length){
					game.delay(2);
					trigger.player.$give(result.buttons[0].link,player);
					player.equip(result.buttons[0].link);
				}
				else{
					player.draw();
				}
			}
			//------------------------------五将----------------------------------//
			lib.skill.anguo.content=function(){
				'step 0'
				player.choosePlayerCard(target,'e',true).ai=function(card){
					if(get.type(card)=='equip1') return 1;
					if(get.type(card)=='equip3') return 0.9;
					if(get.type(card)=='equip2'&&card.name!='baiyin') return 0.8;
					return 0.5;
				}
				'step 1'
				if(result.links){
					var num=0;
					for(var i=0;i<game.players.length;i++){
						if(get.distance(target,game.players[i],'attack')<=1){
							num++;
						}
					}
					event.num=num;
					target.gain(result.links,'gain2');
				}
				else{
					event.finish();
				}
				'step 2'
				var num2=0;
				for(var i=0;i<game.players.length;i++){
					if(get.distance(target,game.players[i],'attack')<=1){
						num2++;
					}
				}
				if(event.num>num2){
					player.draw();
				}
			}
			lib.skill.anguo.ai.result.target=function(player,target){
				if(target.hasSkillTag('noe')) return 1.5;
				if(target.num('e','baiyin')&&target.hp<=1) return 2;
				if(target.get('e','1')||target.get('e','3')) return -1;
				if(target.get('e','2')) return -0.7;
				return -0.5;
			}
			lib.skill.jigong.check=function(event,player){
				var pl=get.skillOwner('guzheng');
				if(pl&&pl.isF(player)) return 1;
				if(player.num('h','nanman')||player.num('h','wanjian')) return 1;
				if(get.maxUse(player)>=player.num('h')*2/3) return 1;
				if(player.hp==1) return 1;
				if(player.hasShaTarget()&&(player.num('e','zhuge')||player.num('h','jiu'))) return 1;
				if(player.num('h','tao')&&!player.isDamaged()) return 0;
				return 0;
			}
			lib.skill.jigong2.ai={
				effect:{
					player:function(card,player,target,current){
						var num=game.checkMod(player,player.hp,'maxHandcard',player.get('s'));
						if(num<2){
							if(card.name=='tao') return [1,2];
						}
						if(card.name=='nanman'||card.name=='wanjian') return [1,3]
					}
				}
			}
			lib.skill.xingxue.content=function(){
				'step 0'
				var num=player.hp;
				if(!player.hasSkill('yanzhu')){
					num=player.maxHp;
				}
				player.chooseTarget([1,num],'是否发动【兴学】？').ai=function(target){
					var att=ai.get.attitude(player,target);
					if(att<=0) return -1;
					if(target.hasSkillTag('noe')) return 12;
					if(target.hasSkill('tuntian')) return 8;
					if(target.num('he')) return att;
					return att/10;
				}
				'step 1'
				if(result.bool){
					player.logSkill('xingxue',result.targets);
					event.targets=result.targets;
					event.targets.sort(lib.sort.seat);
				}
				else{
					event.finish();
				}
				'step 2'
				if(event.targets.length){
					var target=event.targets.shift();
					target.draw();
					event.current=target;
				}
				else{
					event.finish();
				}
				'step 3'
				if(event.current&&event.current.num('he')){
					event.current.chooseCard('选择一张牌置于牌堆顶','he',true).ai=function(card){
						if(!event.targets.length){
							if(player.next.isF(event.current)){
								if(player.next.num('j','lebu')){
									return get.suit(card)=='heart'?10:1;
								}
								if(player.next.num('j','bingliang')){
									return get.suit(card)=='club'?10:1
								}
								if(player.next.num('j','shandian')) return get.suit(card)!='spade'||get.number(card)>9||get.number(card)<2?10:1;
							}
							if(player.next.isE(event.current)){
								if(player.next.num('j','lebu')) return get.suit(card)!='heart'?10:1;
								if(player.next.num('j','bingliang')) return get.suit(card)!='club'?10:1;
								if(player.next.num('j','shandian')) return get.suit(card)=='spade'&&get.number(card)<=9&&get.number(card)>=2?10:1;
							}							
						}
						return 10-ai.get.value(card);
					}					
				}
				else{
					event.goto(2);
				}
				'step 4'
				if(result&&result.cards){
					event.card=result.cards[0];
					event.current.lose(result.cards,ui.special);
					var cardx=ui.create.card();
					cardx.classList.add('infohidden');
					cardx.classList.add('infoflip');
					event.current.$throw(cardx,1000);
				}
				else{
					event.card=null;
				}
				'step 5'
				if(event.current==game.me) game.delay(0.5);
				'step 6'
				if(event.card){
					event.card.fix();
					ui.cardPile.insertBefore(event.card,ui.cardPile.firstChild);
				}
				event.goto(2);
			}
			lib.skill.zuoding.filter=function(event,player){
				return !player.hasSkill('zuoding2')&&get.suit(event.card)=='spade'&&
					event.targets&&event.targets.length&&event.player!=player&&event.targets[0]!=event.player;
			}
			lib.skill.zhanjue.ai={
				order:function(){
					var player=_status.currentPhase;
					if(player.num('h')==1&&!player.num('h',function(card){
						return ai.get.value(card)>=7;
					})) return 12;
					return 1;
				},
				result:{
					target:function(player,target){
						var num=0;
						if(player.num('h')>=2&&target.hasSkill('rejianxiong')&&target.hp!=1) return 0;
						if(target.num('h','sha')&&player.hp<3) return 0;
						if(target.hp==1&&target.num('h')<=2&&player.num('h')<=4) num++; 
						if(player.num('h')>3+num) return 0;
						if(player.num('h','tao')) return 0;
						return ai.get.effect(target,{name:'juedou'},player,target);
					}
				},
				effect:{
					player:function(card,player,target){
						if(_status.currentPhase!=player) return ;
						if(_status.dying) return ;
						if(card.name=='tao'){
							for(var i=0;i<game.players.length;i++){
								var pl=game.players[i];
								if(pl.hp==1&&pl.isE(player)) return [1,3];
							}
						}
					}
				}
			}
			lib.skill.huituo.content=function(){
				'step 0'
				player.chooseTarget('是否发动【恢拓】？').ai=function(target){
					if(ai.get.attitude(player,target)<=0) return -1;
					if(!target.isDamaged()) return -1;
					return ai.get.gainEffect(player,target);
				}
				'step 1'
				if(result.bool){
					player.logSkill('huituo',result.targets);
					var target=result.targets[0];
					event.target=target;
					target.judge(function(card){
						if(target.hp==target.maxHp){
							if(get.color(card)=='red') return 0;
						}
						if(get.color(card)=='red') return 1.5;
						return 1;
					});
				}
				else{
					event.finish();
				}
				'step 2'
				if(result.color){
					if(result.color=='red'){
						if(event.target.hp<event.target.maxHp) event.target.recover();
					}
					else{
						event.target.draw(trigger.num);
					}
				}
			}
			lib.skill.huituo.ai={
				maixie:true,
				effect:{
					target:function(card,player,target){
						if(get.tag(card,'damage')){
							if(player.hasSkill('jueqing')) return [1,-2];
							if(!target.hasFriend()) return;
							if(target.hp>=2) return 0.3;
						}
					}
				}
			}
			lib.skill.mingjian.ai.result.target=function(player,target){
				if(player.hp<=2&&player.num('h','shan')) return 0;
				if(ai.get.attitude(player,target)<3) return 0;
				if(target.hasSkill('reluoyi2')) return 15;
				if(target.hasSkill('rekurou')) return 10;
				return ai.get.gainEffect(player,target);
			}
			delete lib.skill.qiaoshi.priority;
			lib.skill.qiaoshi.check=function(event,player){
				var pl=_status.currentPhase.next;
				while(!pl.isF(player)){
					pl=pl.next;
				}
				if(player.num('h')==pl.hp-1||player.num('h')==pl.hp-2) return 1;
				return ai.get.attitude(player,event.player)>=0;
			}
			lib.skill.yanyu.ai.basic.order=function(skill,player){
				if(player.num('h','sha')>=2||player.getStat().skill.yanyu==1) return 10;
				return 1;
			}
			lib.skill.yanyu2.content=function(){
				'step 0'
				player.chooseTarget('是否发动【燕语】？',function(card,player,target){
					return target.sex=='male'&&target!=player;
				}).ai=function(target){
					return ai.get.gainEffect(player,target);
				}
				'step 1'
				if(result.bool){
					player.logSkill('yanyu',result.targets);
					result.targets[0].draw(2);
				}
			}
			//------------------------------将六----------------------------------//
			lib.skill.duliang2.trigger={player:'phaseDrawBefore'};
			lib.skill.duliang2.priority=6;
			lib.skill.duliang.ai.result={
				target:function(player,target){
					if(target.hasSkill('re_tuxi')) return 1;
					return 0;
				},
				player:1,
			}
			lib.skill.zhige={
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.num('h')>player.hp;
				},
				filterTarget:function(card,player,target){
					return get.distance(target,player,'attack')<=1&&player!=target;
				},
				content:function(){
					'step 0'
					target.chooseToUse({name:'sha'},'止戈：使用一张杀,或将其装备区里的一张牌交给'+get.translation(player));
					'step 1'
					if(!result.bool&&target.num('e')){
						target.chooseCard('e',true,'将其装备区里的一张牌交给'+get.translation(player));
					}
					else{
						event.finish();
					}
					'step 2'
					if(result.bool&&result.cards&&result.cards.length){
						player.gain(result.cards);
						target.$give(result.cards,player);
					}
				},
				ai:{
					order:function(skill,player){
						if(player.num('h')==player.hp+1) return 10;
						return 5;
					},
					result:{
						target:function(player,target){
							if(!target.isF(player)&&!target.num('e')) return 0;
							var sha=target.hasCardTarget('sha');
							var rich=target.num('h')>=3;
							if(rich&&sha) return 0.5;
							if(!rich) return -1.5;
							return -1;
						},
						player:function(player,target){
							if(!target.num('e')) return 0;
							var num=target.num('h');
							var pl=get.maxShaEffect(target);
							if(!pl) pl=player;
							var num2=pl.get('h','shan');
							var num3=pl.num('e','2')&&pl.get('e','2').name!='baiyin';
							return (-(target.num('h')/4)*num2?0.75:1.5)/(num3?2:1);
						}							
					}
				}
			}
			lib.skill.zongzuo.trigger={global:'gameStart'}
			lib.skill.kuangbi={
				audio:2,
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return target.num('he')&&player!=target;
				},
				content:function(){
					'step 0'
					target.chooseCard('选择移出游戏的牌','he',[1,3],true).ai=function(card){
						if(ai.get.attitude(target,player)>=3){
							if(target.hasSkill('xiaoji')){
								var num=get.position(card)=='e'?5:0;
								return 4-ai.get.value(card)+num;
							}
							if(target.hasSkill('xuanfeng')){
								var num=get.position(card)=='e'&&!ui.selected.cards[0]?5:0;
								return 4-ai.get.value(card)+num;
							}
							if(target.hasSkill('relianying')&&target.num('h')<=3){
								var num=get.position(card)=='h'?5:-3;
								return 4-ai.get.value(card)+num;
							}					
						}
						if(ai.get.attitude(target,player)<=0){
							if(!ui.selected.cards[0]) return 4-ai.get.value(card);
							return 0;
						}
						return 4-ai.get.value(card);
					}
					'step 1'
					target.lose(result.cards,ui.special);
					game.log(target,'将',result.cards.length,'张牌置于',player,'的武将牌上');
					player.storage.kuangbi=result.cards;
					player.storage.kuangbi2=target;
					player.syncStorage('kuangbi');
					player.markSkill('kuangbi');
				},
				ai:{
					order:5,
					expose:0.1,
					result:{
						target:function(player,target){
							if(target.hasSkill('xuanfeng')&&target.num('e')) return 2;
							if(target.hasSkill('tuntian')) return 2;
							if(target.hasSkill('xiaoji')) return target.num('e')*3-1;
							if(target.hasSkill('relianying')&&target.num('h')<=3) return target.num('h')*2-2;
							if(ai.get.attitude(player,target)>=0) return 1/(6-target.num('he')+Math.sqrt(get.distance(player,target,'absolute'))+0.5);
							return -1/(target.num('he')+2.5-Math.sqrt(get.distance(player,target,'absolute'))-0.5);
						}
					}
				},
				intro:{
					content:'cardCount'
				},
				init:function(player){
					player.storage.kuangbi=[];
				},
				group:'kuangbi2'
			}
			lib.skill.kuangbi2={
				trigger:{player:'phaseBegin'},
				filter:function(event,player){
					return player.storage.kuangbi&&player.storage.kuangbi.length;
				},
				forced:true,
				content:function(){
					player.gain(player.storage.kuangbi);
					player.$draw(player.storage.kuangbi.length);
					if(player.storage.kuangbi2.isAlive()){
						player.storage.kuangbi2.draw(player.storage.kuangbi.length);
					}
					player.unmarkSkill('kuangbi');
					delete player.storage.kuangbi;
					delete player.storage.kuangbi2;
				}
			}
			lib.skill.jiaozhao.content=function(){
				'step 0'
				player.showCards(cards);
				'step 1'
				if(player.storage.jiaozhao2){
					event.target=player;
				}
				else{
					var targets=game.players.slice(0);
					targets.remove(player);
					targets.sort(function(a,b){
						return Math.max(1,get.distance(player,a))-Math.max(1,get.distance(player,b));
					});
					var distance=Math.max(1,get.distance(player,targets[0]));
					for(var i=1;i<targets.length;i++){
						if(Math.max(1,get.distance(player,targets[i]))>distance){
							targets.splice(i);break;
						}
					}
					player.chooseTarget(true,function(card,player,target){
						return _status.event.targets.contains(target);
					}).set('ai',function(target){
						return ai.get.attitude(_status.event.player,target);
					}).set('targets',targets);
				}
				'step 2'
				if(!event.target){
					event.target=result.targets[0];
					player.line(result.targets,'green');
				}
				if(!event.target){
					event.finish();
					return;
				}
				var list=['sha','sha','sha','jiu','tao'];
				var list2=['nanman','wanjian','taoyuan','wugu','juedou','guohe','shunshou','wuzhong','jiedao','tiesuo','huogong'];
				var nature=['','thunder','fire','',''];
				for(var i=0;i<list.length;i++){
					list[i]=['基本','',list[i],nature[i]];
				};
				for(var i=0;i<list2.length;i++){
					list2[i]=['锦囊','',list2[i]];
				};
				if(player.storage.jiaozhao1){
					var dialog=ui.create.dialog('矫诏:请声明一张牌名',[list,'vcard'],[list2,'vcard']);
				}
				else{
					var dialog=ui.create.dialog('矫诏:请声明一张牌名',[list,'vcard']);
				}
				var att=ai.get.attitude(event.target,player);
				var next=event.target.chooseButton(dialog,true).set('ai',function(button){
					var att=_status.event.att;
					if(att<0){
						return button.link[2]=='jiu'?1:0;
					}
					else{
						if(!_status.event.trick){
							return button.link[2]=='sha'&&button.link[3]=='fire'?1:0;
						}
						var player=_status.currentPhase;
						var nanman=0;
						var wanjian=0;
						var taoyuan=0;
						var random=player.storage.random;
						for(var i=0;i<game.players.length;i++){
							if(!lib.filter.filterTarget({name:'nanman'},player,game.players[i])){
								continue;
							}
							nanman+=ai.get.effect(game.players[i],{name:'nanman'},player);
							wanjian+=ai.get.effect(game.players[i],{name:'wanjian'},player);
						}
						for(var i=0;i<game.players.length;i++){
							if(!lib.filter.filterTarget({name:'taoyuan'},player,game.players[i])){
								continue;
							}
							taoyuan+=ai.get.effect(game.players[i],{name:'taoyuan'},player);
						}
						if((nanman>taoyuan||wanjian>taoyuan)&&(nanman>6||wanjian>6)){
							if(nanman==wanjian){
								return (button.link[2]=='wanjian')?1:-1;
							}
							else if(nanman>wanjian) return (button.link[2]=='nanman')?1:-1;
							else return (button.link[2]=='wanjian')?1:-1;
						}
						if(taoyuan>=10) return (button.link[2]=='taoyuan')?1:-1;
						var list=['shunshou','guohe','tiesuo','juedou'];
						if(get.mostDamage(player)&&get.mostDamage(player).num('h')<=2) list.push('juedou');				
						if(!player.hasCardTarget('shunshou')) list.remove('shunshou');
						if(random<0.4&&list.contains('shunshou')) return (button.link[2]=='shunshou')?1:-1;
						if(random>0.8&&random<0.9) return (button.link[2]=='tiesuo')?1:-1;
						if(random>0.9) return (button.link[2]=='guohe')?1:-1;
						return (button.link[2]=='juedou')?1:-1;
					}
				}).set('att',att).set('trick',player.storage.jiaozhao1);
				next.filterButton=function(button){
					if(player.storage.jiaozhao2==true){
						var name=button.link[2];
						if(name=='tao'||name=='shan'||name=='wuzhong'||name=='jiu') return false;
					}
					return true;
				}
				'step 3'
				event.target.showCards(game.createCard(result.links[0][2]),get.translation(event.target)+'声明了'+get.translation(result.links[0][2]));
				player.storage.jiaozhao=cards[0];
				player.storage.jiaozhao_card=result.links[0][2];
				game.broadcastAll(function(name){
					lib.skill.jiaozhao2.viewAs={name:name};
				},result.links[0][2]);
			}
			lib.skill.jiaozhao2.ai={
				maixie:true,
				order:function(storage,player){
					return ai.get.order({name:player.storage.jiaozhao_card})+0.2;
				},
				effect:{
					player:function(card,player,target){
						if(card==player.storage.jiaozhao&&_status.event.skill!='jiaozhao2') return [0,0,0,0];
					},
					target:function(card,player,target){
						if(!target.hasFriend()) return ;
						if(get.tag(card,'damage')){
							if(target.storage.jiaozhao2==true) return [1,0.3];
							if(!target.isDamaged()) return [1,1.7];							
						}
					}
				}
			}
			//------------------------------SP----------------------------------//
			lib.skill.fengpo.content=function(){
				'step 0'
				player.addTempSkill('fengpo3','phaseAfter');
				var next=player.chooseControl('draw_card','加伤害','cancel')
				next.set('prompt','是否发动【凤魄】？');
				next.set('ai',function(){
					var player=_status.event.player;
					if(player.num('e','guanshi')&&player.num('he')>=3) return 1;
					else return 0;
				})
				'step 1'
				if(result.control&&result.control!='cancel'){
					player.logSkill('fengpo');
					var nd=trigger.target.num('h',{suit:'diamond'});
					if(result.control=='draw_card'){
						player.draw(nd);
					}
					else{
						player.addTempSkill('fengpo2','useCardToAfter');
						player.storage.fengpo=nd;
					}
				}
			}
			lib.skill.naman.ai={
				effect:{
					target:function(card,player,target){
						if(player.num('h','sha')){
							if(card.name=='juedou') return [1,1,1,-2];
						}
					}
				}
			}
			lib.skill.benyu.ai={
				maixie:true,
				effect:{
					target:function(card,player,target){
						if(get.tag(card,'damage')){
							if(player.skills.contains('jueqing')) return [1,-2];
							if(target.hp==1) return;
							var num=target.num('h')-player.num('h');
							var nu=player.num('h');
							var nm=target.num('h');
							if(num<0){
								return [1,Math.min(5-nm,-num)/2];	
							}
						}
					}
				}
			}
			lib.skill.zhidao.ai={
				effect:{
					player:function(card,player,target){
						if(get.tag(card,'damage')){
							if(player.num('h',function(card){
								return !get.tag(card,'damage')&&get.type(card)!='equip'&&player.hasCardTarget(card);
							})) return [0,0,0,0];
							var num=0;
							var num2=0;
							if(target.num('h')) num++;
							if(target.num('e')) num++;
							if(target.num('j')&&target.get('j').name!='shandian') num2+=3;
							return [1,0.6*(num+1),1,0.6*(-num+num2)];
						}
					}
				}
			}
			lib.skill.zhengnan.content=function(){
				'step 0'
				player.draw(3);
				if(player.hasSkill('wusheng')&&player.hasSkill('dangxian')&&player.hasSkill('zhiman')) event.finish();
				var list=[];
				if(!player.hasSkill('wusheng')){
					list.push('wusheng');
				}
				if(!player.hasSkill('dangxian')){
					list.push('dangxian');
				}
				if(!player.hasSkill('zhiman')){
					list.push('zhiman');
				}
				if(list.length){
					player.chooseControl(list).set('prompt','选择获得一项技能');
				}
				'step 1'
				player.addSkill(result.control);
				player.popup(result.control);
				game.log(player,'获得技能','【'+get.translation(result.control)+'】');
			}
			lib.skill.junbing2.filter=function(event,player){
				if(player.num('h')>1) return false;
				if(get.skillOwner('junbing')) return true;
				return false;
			}
			lib.skill.junbing2.content=function(){
				"step 0"
				if(player==get.skillOwner('junbing')){
					player.draw();
					event.finish();
				}
				else{
					player.draw();
					event.target=get.skillOwner('junbing');
				}
				"step 1"
				var cards=player.get('h');
				target.gain(cards);
				event.num=cards.length;
				player.$give(event.num,target);
				game.delay();
				"step 2"
				target.chooseCard('选择还给'+get.translation(player)+'的牌',true,event.num);
				game.delay(0.2);
				"step 3"
				player.gain(result.cards);
				target.$give(result.cards.length,player);
				game.delay();
			}
			lib.skill.kuiwei.check=function(event,player){
				var pl=get.skillOwner('lihun');
				if(pl&&pl.isBE(player)) return 0;
				if(player.isTurnedOver()) return true;
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].get('e','1')) num++;
				}
				return num>1;
			}
			lib.skill.xueji.ai.order=3.5
			lib.skill.qizhi.intro={
				content:'mark'
			}
			lib.skill.qizhi2={
				trigger:{player:['phaseBegin','phaseAfter']},
				forced:true,
				popup:false,
				silent:true,
				content:function(){
					player.storage.qizhi=0;
					player.unmarkSkill('qizhi');
				}
			}
			lib.skill.qizhi.audio=2;
			lib.skill.qizhi.content=function(){
				'step 0'
				player.chooseTarget('是否发动【奇制】？',function(card,player,target){
					return !trigger.targets.contains(target)&&target.num('he')>0;
				}).ai=function(target){
					if(ai.get.attitude(player,target)<=0){
						if(target.hasSkillTag('noe')) return -1;
						if(target.hasSkill('tuntian')) return -10;
						return 1;
					}
					if(ai.get.attitude(player,target)>0){
						if(target.hasSkillTag('noe')) return 3;
						if(target.hasSkill('tuntian')) return 2.2;
						if(target==player) return 2;
						return 0.5;
					}
				};
				'step 1'
				if(result.bool){
					player.storage.qizhi++;
					player.markSkill('qizhi');
					player.updateMarks();
					if(!event.isMine()) game.delay(1);
					player.logSkill('qizhi',result.targets);
					player.discardPlayerCard(result.targets[0],true,'he').ai=function(button){
						if(result.targets[0].isF(player)){
							if(result.targets[0]==player){
								return lib.filter.filterCard(button.link)&&button.link[2]!='sha'?-2:0+8-ai.get.value(button.link);
							}
							return 8-ai.get.value(button.link);
						}
						return ai.get.value(button.link)
					}
					event.target=result.targets[0];
				}
				else{
					event.finish();
				}
				'step 2'
				event.target.draw();
			}
			lib.skill.lihun.check=function(card){
				if(card.name=='guding'||(get.tag(card,'damage')&&card.name!='sha'&&card.name!='huogong')) return 0.01;
				return 8-ai.get.value(card)
			}
			lib.skill.lihun.ai.result.player=function(player,target){
				if(!player.hasEnemy()) return 0;
				if(target.isF(player)) return 0;
				if(target.num('h')<=1) return 0;
				if(player.classList.contains('turnedover')) return 10;
				var num=player.num('h',function(card){
					return get.tag(card,'damage')&&card.name!='sha'&&card.name!='huogong'
				})
				if(player.num('sha')&&player.canUse('sha',target)&&lib.filter.filterCard({name:'sha'},player)){
					if(player.num('he','zhuge')) num+=player.num('h','sha');
					else num++;
					if(player.num('h','jiu')) num++;
					if(player.num('he','guding')) num++;
				}
				return -3.2+target.num('h')-target.hp+num;
			}
			lib.skill.lihun.ai.result.target=function(player,target){
				if(target.isF(player)) return 0;
				if(target.num('h')<=1) return 0;
				var num=player.num('h',function(card){
					return get.tag(card,'damage')&&card.name!='sha'&&card.name!='huogong'
				})
				if(player.num('sha')&&player.canUse('sha',target)&&lib.filter.filterCard({name:'sha'},player)){
					if(player.num('he','zhuge')) num+=player.num('h','sha');
					else num++;
					if(player.num('h','jiu')) num++;
					if(player.num('he','guding')) num++;
				}
				return -target.num('h')+target.hp-num*3;
			}
			lib.skill.lihun2.content=function(){
				"step 0"
				if(player.storage.lihun.isAlive()){
					player.logSkill('lihun',player.storage.lihun);
				}
				game.delay();
				player.removeSkill('lihun2');
				if(player.storage.lihun.classList.contains('dead')){
					event.finish();
				}
				else{
					player.chooseCard('he',true,player.storage.lihun.hp).ai=function(card){
						if(get.subtype(card)=='equip1'||get.subtype(card)=='equip4') return 10;
						return 8-ai.get.value(card);
					}
				}
				"step 1"
				player.storage.lihun.gain(result.cards);
				player.$give(result.cards.length,player.storage.lihun);
			}
			lib.skill.zhenwei.ai.threaten=1.8
			lib.skill.wangzun.content=function(){
				player.draw();
				player.markSkill('wangzun');
				player.line(trigger.player,'green');
				player.storage.wangzun=trigger.player;
				trigger.player.addTempSkill('wangzun3','phaseAfter');
			}
			lib.skill.yongsi.group=['yongsi1','yongsi2','yongsi3']
			lib.skill.yongsi2.audio=['yongsi1',2],
			lib.skill.yongsi2.content=function(){
				'step 0'
				var list=['wei','shu','wu','qun'],num=0;
				for(var i=0;i<game.players.length&&list.length;i++){
					if(list.contains(game.players[i].group)){
						list.remove(game.players[i].group);
						num++;
					}
				}
				player.chooseToDiscard(num,'he',true);
				'step 1'
				player.storage.yongsi=result.cards;
			}
			lib.skill.yongsi2.ai={
				effect:{
					player:function(card,player,target){
						var list=['wei','shu','wu','qun'],num=0;
						for(var i=0;i<game.players.length&&list.length;i++){
							if(list.contains(game.players[i].group)){
								list.remove(game.players[i].group);
								num++;
							}
						}
						if(player.num('he')<=num){
							if(card.name=='tao'&&!_status.dying) return [1,3];
						}
					}
				}
			}
			lib.skill.yongsi3={
				trigger:{player:'phaseDiscardEnd'},
				popup:false,
				silent:true,
				forced:true,
				content:function(){
					if(!trigger.cards) trigger.cards=player.storage.yongsi;
					else{
						if(player.storage.yongsi){
							for(var i=0;i<player.storage.yongsi.length;i++){
								trigger.cards.push(player.storage.yongsi[i])
							}
						}
					}
					player.storage.yongsi=null;
				}
			}
			lib.skill.juyi.ai={
				effect:{
					target:function(card,player,target){
						if(target.maxHp>game.players.length&&!target.isDamaged()&&!target.storage.juyi){
							if(get.tag(card,'damage')) return [1,target.maxHp-target.num('h')-1]
						}
					}
				}
			}
			lib.skill.suiren.content=function(){
				"step 0"
				var check=(player.hp==1||(player.hp==2&&player.num('h')<=1));
				player.chooseTarget('是否发动【随仁】？').ai=function(target){
					if(!check) return 0;
					return ai.get.gainEffect(player,target);
				}
				"step 1"
				if(result.bool){
					player.storage.suiren=true;
					player.unmarkSkill('suiren');
					player.logSkill('suiren',result.targets);
					player.removeSkill('yicong');
					player.gainMaxHp();
					player.recover();
					result.targets[0].draw(3);
				}
			}
			lib.skill.hongyuan.content=function(){
				"step 0"
				var check;
				if(player.num('h')==0){
					check=false;
				}
				else{
					var i,num=0;
					for(i=0;i<game.players.length;i++){
						if(player!=game.players[i]){
							if(ai.get.attitude(player,game.players[i])>1){
								num++;
							}
						}
					}
					check=(num>=2);
				}
				player.chooseTarget('是否发动【弘援】？',[1,2],function(card,player,target){
					return player!=target;
				},
				function(target){
					if(!check) return 0;
					return ai.get.gainEffect(_status.event.player,target);
				});
				"step 1"
				if(result.bool){
					player.logSkill('hongyuan',result.targets);
					game.asyncDraw(result.targets);
					trigger.num--;
				}
			}
			lib.skill.songci.ai.result.target=function(player,target){
				if(target.num('h')<target.hp){
					if(target.num('h')<=3) return 1;
				}
				else if(target.num('h')>target.hp){
					if(target.num('h')<=4) return -1;
				}
			}
			lib.skill.chongzhen1={
				audio:2,
				trigger:{player:'shaBefore'},
				filter:function(event,player){
					if(event.skill!='longdan_sha') return false;
					return event.target.num('h')>0;
				},
				direct:true,
				content:function(){
					'step 0'
					player.choosePlayerCard('是否对'+get.translation(trigger.target)+'发动【冲阵】？','h',trigger.target).ai=function(card){
						if(ai.get.attitude(player,trigger.target)>=3&&trigger.target.num('h')<=3) return 0;
						return Math.random();
					}
					'step 1'
					if(result.bool){
						player.logSkill('chongzhen1',trigger.target);
						player.gain(result.links[0]);
						trigger.target.$give(1,player);
						game.delay();
					}
				}
			}
			lib.skill.chongzhen2={
				audio:2,
				trigger:{player:'respond'},
				filter:function(event,player){
					if(event.skill!='longdan_shan'&&event.skill!='longdan_sha') return false;
					return event.source&&event.source.num('h')>0;
				},
				direct:true,
				content:function(){
					'step 0'
					player.choosePlayerCard('是否对'+get.translation(trigger.source)+'发动【冲阵】？','h',trigger.source).ai=function(card){
						if(ai.get.attitude(player,trigger.source)>=3&&trigger.source.num('h')<=3) return 0;
						return Math.random();
					}
					'step 1'
					if(result.bool){
						player.logSkill('chongzhen2',trigger.source);
						player.gain(result.links[0]);
						trigger.source.$give(1,player);
						game.delay();
					}
				}
			}
			lib.skill.tianming={
				audio:2,
				trigger:{target:'shaBegin'},
				check:function(event,player){
					var cards=player.get('h');
					if(cards.length<=2){
						for(var i=0;i<cards.length;i++){
							if(player.hp==1&&cards[i].name=='jiu') return false;
							if(cards[i].name=='shan'||cards[i].name=='tao') return false;
						}
					}
					return true;
				},
				content:function(){
					"step 0"
					player.chooseToDiscard(2,true,'he');
					player.draw(2);
					var players=game.players.slice(0);
					players.sort(function(a,b){
						return b.hp-a.hp;
					});
					if(players[0].hp>players[1].hp&&players[0]!=player){
						players[0].chooseBool('是否发动天命？').ai=function(){
							if(players[0].num('h')<=2){
								if(players[0].num('h',function(card){
									return ai.get.value(card)>=7.2
								})) return false;
							}
							return true;
						}
						event.player=players[0];
					}
					else{
						event.finish();
					}
					"step 1"
					if(result.bool){
						event.player.chooseToDiscard(2,true,'he')
						event.player.draw(2);
					}
				},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(target.hp>=3&&card.name=='sha') return [1,1];
							if(card.name=='sha') return [1,0.5];
						}
					}
				}
			}
			lib.skill.mizhao.ai.result.target=function(player,target){
				if(ai.get.attitude(player,target)>=0){
					if(target.num('h')+player.num('h')<3) return 0;
					if(player.num('h')>=3){
						if(target.num('j','lebu')) return 0;
						if(target.num('h')>=4) return 0.02;
						if(target.num('j','bingliang')) return player.num('h');
						
					}
					var num=0;
					if(target.num('e','2')) num+=2;
					num+=Math.min(5,target.num('h')+player.num('h')-3);
					if(target.hasSkill('reluoyi2')) num+=4;
					if(target.hasSkill('releiji')) num+=4;
					if(target.hasSkill('leiji')) num+=3.5;
					if(target.hasSkill('moukui')) num+=3;
					if(target.hasSkill('retieji')) num+=2;
					if(target.hasSkill('chongzhen')) num+=2;
					if(target.hasSkill('xinpojun')) num+=1.8; 
					if(target.hasSkill('lieren')) num+=1.7; 
					if(target.hasSkill('liegong')) num++;
					if(target.hasSkill('mingzhe')) num+=0.8;
					return num;
				}
				if(player.num('h')==1){
					return -2/(target.num('h')+1);
				}
			}
			lib.skill.yishe.content=function(){
				'step 0'
				player.draw(2);
				player.chooseCard(2,'he',true,'选择两张牌作为"米"').ai=function(card){
					if(player.hasLebuFirend()){
						if(get.suit(card)=='heart') return 7;
					}
					if(player.hasBingFirend()){
						if(get.suit(card)=='club') return 7;
					}
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].num('j','shandian')){
							if(card.number<=9&&card.number>=2&&get.suit(card)=='spade') return 8;
						}
					}
					return 10-ai.get.value(card);
				}
				'step 1'
				player.markSkill('yishe');
				player.storage.yishe=result.cards;
				player.lose(result.cards,ui.special);
				game.addVideo('storage',player,['yishe',get.cardsInfo(player.storage.yishe),'cards']);
			}
			lib.skill.midao.content=function(){
				"step 0"
				var list=player.storage.yishe;
				var dialog=ui.create.dialog(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+get.translation(trigger.player.judging[0])+
					',是否发动【米道】？',list,'hidden');
				player.chooseButton(dialog,function(button){
					event.num=2;
					var card=button.link;
					var trigger=_status.event.parent._trigger;
					var player=_status.event.player;
					var result=trigger.judge(card)-trigger.judge(trigger.player.judging[0]);
					var attitude=ai.get.attitude(player,trigger.player);
					event.current=trigger.player.next;
					while(event.num>0){
						if(event.current==player) return result*attitude+0.1;
						event.current=event.current.next;						
						event.num--;
					}
					return result*attitude;
				})
				"step 1"
				if(result.bool){
					event.card=result.buttons[0].link;
					player.$throw(event.card,1000);
					player.storage.yishe.remove(result.buttons[0].link);
					player.updateMarks();
					if(player.storage.yishe.length==0){
						player.recover();
						player.unmarkSkill('yishe');
					}
					if(event.card.clone){
						event.card.clone.classList.add('thrownhighlight');
						game.addVideo('highlightnode',player,get.cardInfo(event.card));
					}
				}
				"step 2"
				if(event.card){
					player.logSkill('midao',trigger.player);
					ui.discardPile.appendChild(trigger.player.judging[0]);
					trigger.player.judging[0]=event.card;
					trigger.position.appendChild(event.card);
					game.log(trigger.player,'的判定牌改为',event.card);
					event.card.expired=true;
					game.delay(2);
				}
			}
			lib.skill.bushi.ai={
				maixie:true,
				threaten:function(player,target){
					if(!target.storage.yishe||!target.storage.yishe.length) return 2;
				},
				effect:{
					player:function(card,player,target){
						if(get.tag(card,'damage')){
							if(player.storage.yishe.length==1) return [1,0.5,1,0.5]
							if(player.storage.yishe.length==2){
								if(player.isDamaged())  return [1,1.5,1,0.5]
							}
						}
					},
					target:function(card,player,target){
						if(!target.hasFriend()) return ;
						if(get.tag(card,'damage')){
							if(target.hp==1) return ;							
							if(target.storage.yishe.length==2) return [1,1]
							if(target.storage.yishe.length==1){
								if(player.next==target||player.next.next==target) return [1,2.5];
								return [1,2];
							} 
						}
					}
				}
			}
			lib.skill.kunfen={
				trigger:{player:'phaseEnd'},
				forced:true,
				filter:function(event,player){
					return !player.storage.kunfen;
				},
				content:function(){
					player.loseHp();
					player.draw(2);
				},
				ai:{
					threaten:1.8
				}
			}
			lib.skill.fengliang.content=function(){
				"step 0"
				player.loseMaxHp();
				"step 1"
				if(player.hp<2){
					player.recover(2-player.hp);
				}
				"step 2"
				player.addSkill('tiaoxin');
				player.removeSkill('kunfen');
				player.addSkill('kunfen2');
				player.storage.kunfen=true;
			}
			lib.translate.kunfen2='困奋'
			lib.translate.kunfen2_info='回合结束阶段,你可以失去一点体力,然后摸2张牌'
			lib.skill.kunfen2={
				trigger:{player:'phaseEnd'},
				filter:function(event,player){
					return player.storage.kunfen;
				},
				check:function(event,player){
					if(player.hp>2) return true;
					if(player.hp==2&&player.num('h')==0) return true;
					return false;
				},
				content:function(){
					player.loseHp();
					player.draw(2);
				}
			}
			lib.skill.kaikang.check=function(event,player){
				if(player.num('h','shandian')) return true;
				return ai.get.attitude(player,event.target)>=0;
			}
			lib.skill.kaikang.priority=20;
			lib.skill.kaikang.content=function(){
				"step 0"
				player.line(trigger.target,'green');
				player.draw();
				if(trigger.target!=player){
					player.chooseCard(true,'he','交给'+get.translation(trigger.target)+'一张牌').ai=function(card){
						if(trigger.target.isBF(player)){
							if(trigger.target.hp<=2){
								if(get.subtype(card)=='equip2') return 10;
								if(get.type(card)!='basic'&&trigger.target.hasSkill('buyi')) return 8;
							}
							if(card.name=='shan') return 9;
							return 10-ai.get.value(card);
						}
						else{
							return 10-ai.get.value(card);
						}
					}
				}
				else{
					event.finish();
				}
				"step 1"
				trigger.target.gain(result.cards);
				player.$give(result.cards,trigger.target);
				game.delay();
				event.card=result.cards[0];
				if(get.type(event.card)!='equip') event.finish();
				"step 2"
				if(!trigger.target.isMin()){
					trigger.target.chooseBool('是否装备'+get.translation(event.card)+'？').ai=function(){
						var current=trigger.target.get('e',{subtype:get.subtype(event.card)});
						if(current&&current.length){
							return ai.get.equipValue(event.card)>ai.get.equipValue(current[0]);
						}
						return true;
					};
				}
				else{
					event.finish();
				}
				"step 3"
				if(result.bool){
					trigger.target.equip(event.card);
				}
			}
			//------------------------------国战----------------------------------//
			if(lib.character.dingfeng) lib.character.dingfeng[3]=['fenxun','duanbing']
			lib.skill.fenxun={
				audio:2,
				enable:'phaseUse',
				usable:1,
				filterTarget:function(card,player,target){
					return player!=target;
				},
				filterCard:true,
				position:'he',
				filter:function(event,player){
					return player.num('he')>0;
				},
				check:function(card){
					var player=_status.currentPhase;
					if(player.num('h','sha')==1){
						if(card.name=='sha') return -1;
					}
					return 11-ai.get.value(card);
				},
				content:function(){
					player.storage.fenxun=target;
					player.addTempSkill('fenxun2','phaseAfter');
				},
				ai:{
					order:4.2,
					result:{
						target:function(player,target){
							if(!player.num('h','sha')) return 0;
							if(!lib.filter.filterCard({name:'sha'},player)) return 0;
							var num=0,num1=0;
							for(var i=0;i<game.players.length;i++){
								var pl=game.players[i];
								if(get.distance(player,pl)<=1&&ai.get.effect(pl,{name:'sha'},player)>0) num++;
							}
							if(num>=2) return 0;
							for(var i=0;i<game.players.length;i++){
								var pl=game.players[i];
								if(get.distance(player,pl,'attack')<=1&&ai.get.effect(pl,{name:'sha'},player)>0&&get.distance(player,pl)>1) num1++;
							}
							if(num1>=1&&num>=1) return 0;
							if(get.distance(player,target,'attack')<=1) return 0;
							if(ai.get.effect(target,{name:'sha'},player)<=0) return 0;
							return -ai.get.effect(target,{name:'sha',color:'black'},player,player);
						}
					},
					effect:{
						player:function(card,player,target){
							if(card.name=='sha'){
								for(var i=0;i<game.players.length;i++){
									var pl=game.players[i],num=0;
									if(get.distance(player,pl)<=1&&pl.isE(player)) num++;
								}
								if(num==1){
									if(get.distance(player,target)>1) return [1,0,5,0];
								}								
							}
						}
					}
				}
			}
			lib.skill.fenxun2={
				mod:{
					globalFrom:function(from,to){
						if(to==from.storage.fenxun) return -Infinity;
					}
				}
			}
			lib.translate.fenxun_info='出牌阶段限一次,你可以弃置一张牌并选择一名其它角色,你与其距离为1直到回合结束'
			lib.skill.duanbing={
				audio:2,
				trigger:{player:'shaBefore'},
				direct:true,
				filter:function(event,player){
					return !player.hasSkill('shibei2');
				},
				content:function(){
					'step 0'
					player.chooseTarget('是否发动短兵？',function(card,player,target){
						return player.canUse('sha',target)&&get.distance(player,target)<=1&&!trigger.targets.contains(target)
					}).ai=function(target){
						return ai.get.effect(target,{name:'sha'},player);
					}
					'step 1'
					if(result.bool){
						player.logSkill('duanbing',result.targets[0]);
						trigger.targets.push(result.targets[0]);
						player.addTempSkill('shibei2','useCardAfter');
					}
				}
			}
			lib.translate.duanbing='短兵'
			lib.translate.duanbing_info='你的杀可以额外指定一个距离为1的目标'
			lib.skill.zhendu.content=function(){
				"step 0"
				var no=ai.get.attitude(trigger.player,player)==0&&!player.num('h','shan');
				var nono=(Math.abs(ai.get.attitude(player,trigger.player))<3);
				var nonono=trigger.player.hasCardTarget('sha')&&trigger.player.num('h')>=4&&trigger.player.hp!=1&&Math.random()<0.8;
				var next=player.chooseToDiscard('是否对'+get.translation(trigger.player)+'发动【鸩毒】？');
				next.ai=function(card){
					if(no||nono||nonono) return -1;
					if(ai.get.damageEffect(trigger.player,player,player)>0){
						return 7-ai.get.useful(card);
					}
					return -1;
				}
				next.logSkill=['zhendu',trigger.player];
				"step 1"
				if(result.bool){
					trigger.player.damage();
				}
				else{
					event.finish();
				}
				"step 2"
				trigger.player.useCard({name:'jiu'},trigger.player);
			}
			lib.skill.qiluan={
				audio:2,
				trigger:{global:'phaseEnd'},
				frequent:true,
				filter:function(event,player){
					return player.storage.ql?true:false;
				},
				content:function(){
					player.draw(3*player.storage.ql);
					player.storage.ql=0;
				},
				init:function(player){
					player.storage.ql=0;
				},
				group:['qiluan2']
			}
			lib.skill.qiluan2={
				trigger:{source:'dieAfter'},
				forced:true,
				silent:true,
				popup:false,
				content:function(){
					player.storage.ql++;
				}
			}
			lib.translate.qiluan_info='一名角色的回合结束时,你可以摸3X张牌(X为你与此回合杀死的角色数)'
			lib.skill.xiaoguo.check=function(event,player){
				return ai.get.damageEffect(event.player,player,player)>0&&ai.get.attitude(player,event.player)<0;
			}
			lib.skill.xiaoguo.content=function(){
				"step 0"
				var nono=(Math.abs(ai.get.attitude(player,trigger.player))<3);
				var next=player.chooseToDiscard('是否发动【骁果】？',{type:'basic'});
				next.ai=function(card){
					if(nono) return 0;
					if(ai.get.damageEffect(trigger.player,player,player)>0){
						return 6-ai.get.useful(card);
					}
					return 0;
				}
				next.logSkill=['xiaoguo',trigger.player];
				"step 1"
				if(result.bool){
					var nono=(ai.get.damageEffect(trigger.player,player,trigger.player)>=0);
					trigger.player.chooseToDiscard('he',{type:'equip'}).ai=function(card){
						if(nono){
							return 0;
						}
						if(trigger.player.isSafe()){
							if(player.num('h')<=2) return 0;
						}
						if(trigger.player.hp==1) return 10-ai.get.value(card);
						return 6.5-ai.get.value(card);
					}
				}
				else{
					event.finish();
				}
				"step 2"
				if(result.bool){
					player.draw();
				}
				else{
					trigger.player.damage();
				}
			}
			//------------------------------界限----------------------------------//
			lib.skill.retishen.ai={
				effect:{
					target:function(card,player,target){
						if(target.hp<=2) return ;
						if(target.storage.retishen) return ;
						if(get.tag(card,'damage')){
							var num=target.storage.retishen2-target.hp;
							return [1,num];
						}
					}
				}
			}
			lib.skill.retuxi.content=function(){
				"step 0"
				player.chooseTarget('是否发动突袭?',[1,trigger.num],function(card,player,target){
					return target.num('h')>0&&player!=target&&target.num('h')>=player.num('h');
				},function(target){
					var att=ai.get.attitude(_status.event.player,target);
					if(target.skills.contains('tuntian')) return att/10;
					return 1-att;
				});
				"step 1"
				if(result.bool){
					player.logSkill('retuxi',result.targets);
					for(var i=0;i<result.targets.length;i++){
						player.gain(result.targets[i].get('h').randomGet());
						result.targets[i].$give(1,player);
					}
					trigger.num-=result.targets.length;
				}
			}
			lib.skill.rerende.filterTarget=function(card,player,target){
				return player!=target&&!target.skills.contains('rerende3');
			}
			lib.skill.rerende.check=function(card){
				var player=get.owner(card);
				if(ui.selected.cards.length>=2) return 0;
				if(player.hp==player.maxHp||player.storage.rende<0||player.num('h')<=1){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].get('s').contains('haoshi')&&
							!game.players[i].isTurnedOver()&&
							!game.players[i].num('j','lebu')&&
							ai.get.attitude(player,game.players[i])>=3&&
							ai.get.attitude(game.players[i],player)>=3){
							return 11-ai.get.value(card);
						}
					}
					if(player.num('h')>player.hp) return 10-ai.get.value(card);
					if(player.num('h')>2) return 6-ai.get.value(card);
					return -1;
				}
				return 10-ai.get.value(card);
			}
			lib.skill.rerende.content=function(){
				'step 0'
				target.gain(cards);
				target.addTempSkill('rerende3','phaseAfter');
				game.delay();
				if(typeof player.storage.rende!='number'){
					player.storage.rende=0;
				}
				if(player.storage.rende>=0){
					player.storage.rende+=cards.length;
				}
				'step 1'
				if(player.storage.rende>=2){
					player.storage.rende=-1;
					var list=[];
					var list1=['sha','sha','sha','jiu','tao'];			
					var nature=['','thunder','fire','',''];
					for(var i=0;i<list1.length;i++){
						list.push(['基本','',list1[i],nature[i]]);
					}			
					var dialog=ui.create.dialog('是否视为使用一张基本牌？',[list,'vcard']);
					if(list.length>0){
						var next=player.chooseButton(dialog,function(button){
							if(player.hp>=3){
								if(player.hasCardTarget('sha')){
									if(!player.num('h','sha')) return (button.link[2]=='sha'&&button.link[3]=='fire')?1:-1;
									if(player.num('h','sha')) return (button.link[2]=='jiu')?1:-1;
								}
							}
							if(player.isDamaged()) return (button.link[2]=='tao')?1:-1;
						});
						next.filterButton=function(button){
							var trigger=_status.event.getParent().getParent().getParent();
							return trigger.filterCard({name:button.link[2]},player,trigger);
						}
					}
				}
                'step 2'
                if(result.bool){               
					lib.skill.rerende4.viewAs={name:result.buttons[0].link[2],nature:result.buttons[0].link[3]};
						event.parent.parent.backup('rerende4');
						event.parent.parent.step=0;
						if(event.isMine()){
							event.parent.parent.openskilldialog='请选择'+get.translation(result.buttons[0].link[2])+'的目标';
						}
						event.finish();
				}
			}
			lib.skill.rerende.ai.order=function(skill,player){
				if(player.hp<player.maxHp&&player.storage.rende<2&&player.num('h')>1){
					return 10;
				}
				return 5;
			}
			lib.skill.rerende.ai.result.target=function(player,target){
				var nh=target.num('h');
				var np=player.num('h');
				if(player.hp==player.maxHp||player.storage.rerende<0||player.num('h')<=1){
					if(nh>=np-1&&np<=player.hp&&!target.get('s').contains('haoshi')) return 0;
				}
				return ai.get.gainEffect(player,target);
			}
			lib.skill.rerende.ai.threaten=1.5;
			lib.skill.rerende1.content=function(){
				player.storage.rende=0;
			}
			lib.skill.rerende3={}
			lib.skill.rerende4={
				filterCard:function(){return false},
				selectCard:-1
			}
			lib.skill.reqianxun.ai.effect=function(card,player,target){
				if(card.name=='tiesuo'&&player==target) return ;
				if(get.type(card,'trick')=='trick'&&ui.selected.targets.length==0) return [1,target.num('h')-1];
			}
			lib.skill.liyu.ai={
				effect:{
					player:function(card,player,target){
						if(card.name=='sha'){
							var num=target.isF(player)?2:-2;
							if(!target.num('he')) num=0;
							if(target.hasSkillTag('maixie')) return [1,1+num,1,-Math.abs(num)/4];
							if(!player.hasShaTarget()){
								var num=target.isF(player)?2:0;
								if((target.hasSkill('shibei')&&!target.hasSkill('shibei2'))||target.hasSkill('yuce')) return [1,1+num];
							}
						}
					}
				}
			}
			lib.skill.retieji2.popup=false;
			lib.skill.retieji.content=function(){
				"step 0"
				player.line(trigger.target,'green');
				player.judge(function(){return 0});
				var target=trigger.target;
				if(target.hasSkill('retieji2')==false){
					target.disabledSkills.retieji=[];
					for(var i=0;i<target.skills.length;i++){
						if(!get.skillLocked(target.skills[i])){
							target.disabledSkills.retieji.push(target.skills[i]);
						}
					}
					target.addSkill('retieji2');
				}
				"step 1"
				var suit=get.suit(result.card);
				var target=trigger.target;
				var num=target.num('h','shan');
				target.chooseToDiscard('请弃置一张'+get.translation(suit)+'牌,否则不能使用闪抵消此杀','he',function(card){
					return get.suit(card)==suit;
				}).ai=function(card){
					if(num==0) return 0;
					if(card.name=='shan') return num>1;
					return 8-ai.get.value(card);
				};
				"step 2"
				if(!result.bool){
					trigger.directHit=true;
				}
			}
			lib.skill.retieji.ai={
				effect:{
					player:function(card,player,target){
						if(card.name=='sha'&&target.hasSkillTag('maixie')&&target.isE(player)) return [1,0,1,-2];
						if(player.num('h','sha')&&player.hasShaTarget()&&!player.getStat().card.sha){
							if(get.tag(card,'damage')&&card.name!='sha') return [0,0,0,0]
						}
					}					
				}
			}
			lib.skill.relianying.ai.effect.player=function(card,player,target,current){
				if(_status.dying) return ;
				if(player.num('h')>player.hp) return ;
				if(_status.currentPhase!=player) return ;
				if(get.maxUse(player)==player.num('h')) return [1,2];
			}
			lib.skill.reluoyi.check=function(event,player){
				if(player.hasShaTarget()) return true;
				var pl1=get.skillOwner('lijian');
				var pl2=get.skillOwner('mizhao');
				var pl3=get.skillOwner('mingce');
				if(pl1&&pl1.isF(player)||pl2&&pl2.isF(player)||pl3&&pl3.isF(player)) return true;
				return Math.random()<0.75;
			}
			lib.skill.reluoyi2.ai={
				effect:{
					player:function(card,player,target){
						if(card.name=='sha'||card.name=='juedou') return [1,0,1,-3];
					}
				}				
			}
			lib.skill.rejianxiong.ai.effect.target=function(card,player,target){
				if(player.hasSkill('jueqing')) return [1,-2];
				if((card.name=='nanman'||card.name=='wanjian')&&target.identity!='fan'){
					for(var i=0;i<game.players.length;i++){
						var pl=game.players[i];
						var num=0;
						if(pl!=target) num+=ai.get.effect(pl,card,target);
					}
					if(num>0) return [1,2];
				}
				if(get.tag(card,'damage')&&player!=target) return [1,0.5];
			}
			lib.skill.reyiji.content=function(){
				"step 0"
				event.num=1;
				event.count=1;
				"step 1"
				player.gain(get.cards(2));
				player.$draw(2);
				"step 2"
				player.chooseCardTarget({
					filterCard:true,
					selectCard:[1,2],
					filterTarget:function(card,player,target){
						return player!=target&&target!=event.temp;
					},
					ai1:function(card){
						if(ui.selected.cards.length>0) return -1;
						return (_status.event.player.num('h')-_status.event.player.hp+1);
					},
					ai2:function(target){
						return ai.get.gainEffect(_status.event.player,target);
					},
					prompt:'请选择要送人的卡牌'
				});
				"step 3"
				if(result.bool){
					player.lose(result.cards,ui.special);
					if(result.targets[0].hasSkill('reyiji2')){
						result.targets[0].storage.reyiji2=result.targets[0].storage.reyiji2.concat(result.cards);
					}
					else{
						result.targets[0].addSkill('reyiji2');
						result.targets[0].storage.reyiji2=result.cards;
					}
					player.$give(result.cards.length,result.targets[0]);
					game.addVideo('storage',result.targets[0],['reyiji2',get.cardsInfo(result.targets[0].storage.reyiji2),'cards']);
					if(num==1){
						event.temp=result.targets[0];
						event.num++;
						event.goto(2);
					}
					else if(event.count<trigger.num){
						delete event.temp;
						event.num=1;
						event.count++;
						event.goto(1);
					}
				}
				else if(event.count<trigger.num){
					delete event.temp;
					event.num=1;
					event.count++;
					event.goto(1);
				}
			}
			lib.skill.yijue.ai.order=function(name,player){
				var cards=player.get('h');
				if(player.num('h','sha')==0&&!player.num('he',{color:'red'})) return 1;
				for(var i=0;i<cards.length;i++){
					if(cards[i].number>=10&&ai.get.value(cards[i])<7){
						return 7;
					}
				}
				return 5;
			}
			lib.skill.yijue2.popup=false;
			lib.skill.refanjian.check=function(card){
				if(card.name=='tao'||card.name=='jiu') return 0;
				return 8-ai.get.value(card);
			}
			lib.skill.refanjian.content=function(){
				"step 0"
				target.storage.refanjian=cards[0];
				target.gain(cards[0]);
				"step 1"
				target.chooseControl('refanjian_card','refanjian_hp').ai=function(event,player){
					if(player.hasSkill('zhaxiang')) return 1;
					if(player.hasSkill('hunzi')) return 1;
					var cards=player.get('he',{suit:get.suit(player.storage.refanjian)});
					if(cards.length==1) return 0;
					if(cards.length>=2){
						for(var i=0;i<cards.length;i++){
							if(get.tag(cards[i],'save')) return 1;
						}
					}
					if(player.hp==1) return 0;
					for(var i=0;i<cards.length;i++){
						if(ai.get.value(cards[i])>=8) return 1;
					}
					if(cards.length>2&&player.hp>2) return 1;
					if(cards.length>3) return 1;
					return 0;
				}
				"step 2"
				if(result.control=='refanjian_card'){
					target.showHandcards();
				}
				else{
					target.loseHp();
					event.finish();
				}
				"step 3"
				target.discard(target.get('he',{suit:get.suit(target.storage.refanjian)}))
				delete target.storage.refanjian;
			}
			lib.skill.refanjian.ai.order=6;
			lib.skill.refanjian.ai.target=function(player,target){
				if(target.hasSkill('zhaxiang')&&target.hp>2){
					var dist=get.distance(player,target,'absolute');
					 return 2+1.5/Math.sqrt(dist);
				}
				if(target.hasSkill('hunzi')&&target.hp==2&&get.distance(player,target,'absolute')<=2) return 2;
				var num=target.hasSkill('maixie')?1:0;
				return -target.num('he')-num;
			}
			lib.skill.rekurou.check=function(card){
				var player=_status.currentPhase;
				if(!player.isDamaged()){
					if(card.name=='baiyin') return 0;
				}
				if(player.isDamaged()){
					if(card.name=='baiyin') return 10;
				}
				if(card.name=='sha'&&get.color(card)=='red') return 0.2;
				if(card.name=='jiu') return 0.2;
				if(card.name=='zhuge') return 0.2;
				return 8-ai.get.value(card);
			}
			lib.skill.rekurou.ai.order=function(player){
				if(player.hp==1) return 1;
				return 8;
			}
			lib.skill.rekurou.ai.result.player=function(player){
				var pl1=get.skillOwner('buyi');
				var pl2=get.skillOwner('jijiu');
				if(player.hp==1){
					if((pl1&&pl1.isF(player))||pl2&&pl2.isF(player)) return 1;
					if(player.num('h','jiu')) return 1;
					if(!player.num('e','2')&&!player.num('e','3')) return 1;
				}
				if(player.num('h',{name:'sha',color:'red'})||player.num('h','jiu')) return 1;
				return player.num('h')<=player.hp+1?1:0;
			}
			lib.skill.zhaxiang2.ai={
				effect:{
					player:function(card,player,target){
						if(player.hasSkill('jiu')&&player.num('h',{name:'sha',color:'red'})){
							if(card.name=='sha'&&get.color(card)!='red') return [0,0,0,0]
						}
					}
				}
			}
			lib.skill.chulao.ai.order=6
			lib.skill.xunxun.content=function(){
				"step 0"
				event.cards=get.cards(4);
				player.chooseCardButton(event.cards,2,'选择获得两张牌').ai=function(button){
					if(button.link[2]=='nanman'||button.link[2]=='wanjian') return 10;
					return ai.get.value(button);
				}
				"step 1"
				if(result.bool){
					player.logSkill('xunxun');
					trigger.untrigger();
					trigger.finish();
					var choice=[];
					for(var i=0;i<result.links.length;i++){
						choice.push(result.links[i]);
						cards.remove(result.links[i]);
					}
					for(var i=0;i<cards.length;i++){
						ui.cardPile.appendChild(cards[i]);
					}
					player.gain(choice,'draw');
					game.log(player,'获得了两张牌')
				}
			}
			lib.skill.wangxi={
				audio:2,
				trigger:{player:'damageEnd',source:'damageEnd'},
				filter:function(event){
					return event.num&&event.source&&event.player&&
					event.player.isAlive()&&event.source.isAlive()&&event.source!=event.player;
				},
				check:function(event,player){
					var list=['paoxiao','zhiheng','yongsi','tianyi','qiangwu','jijiu','zhenwei','beige','yiji','reyiji','buyi','chengxiang','zhuge_skill'];
					var num=0;
					var twopl=[event.player,event.source];
					twopl.remove(player);
					for(var i=0;i<list.length;i++){
						if(ai.get.attitude(player,twopl[0])<=-3&&twopl[0].hasSkill(list[i])) num++;
					}
					if(num)	return 0;
					if(player==event.source){
						if(event.player.num('j','lebu')) return 1;
						if(event.parent.name=='nanman'||event.parent.name=='wanjian') return 1;
						if(event.player.hasSkill('jieming')) return 1;
						if(player.num('e','zhuge')&&player.num('h','sha')>=1) return 1;
						return ai.get.attitude(player,event.player)>-3;
					}					
					else{
						return ai.get.attitude(player,event.source)>-3;
					}
				},
				content:function(){
					'step 0'
					var twopl=[trigger.player,trigger.source];
					twopl.remove(player);
					player.line(twopl[0]);
					game.asyncDraw([player,twopl[0]],trigger.num);
					'step 1'
					game.delay();
				},
				ai:{
					effect:{
						player:function(card,player){
							if(card.name=='nanman'||card.name=='wanjian') return [1,3];
						}
					}
				}
			}
			//------------------------------神将----------------------------------//
			if(lib.character.shen_lvbu){
				lib.character.shen_lvbu[3]=['baonu','shenfen','wuqian','wumou']
			}
			if(lib.character.shen_guanyu){
				lib.character.shen_guanyu[2]=5
			}
			lib.skill.wumou={
				audio:2,
				trigger:{player:'useCard'},
				forced:true,
				filter:function(event,player){
					return get.type(event.card)=='trick';
				},
				content:function(){
					'step 0'
					player.chooseControl('减少标记','流失体力').ai=function(){
						if(player.hp>=5) return '流失体力'
						if(player.hp<=2) return '减少标记'
						if(player.storage.baonu>=4) return '流失体力'
						if(player.storage.baonu<=3) return '减少标记'
					}
					'step 1'
					if(result.control=='减少标记'){
						player.storage.baonu--;
						player.updateMarks();
					}
					else{
						player.loseHp();
					}
				}
			}
			lib.translate.wumou='无谋'
			lib.translate.wumou_info='锁定技,当你使用一张非延时锦囊时,你须选择一项:弃置一枚暴怒标记,或流失一点体力'
			lib.translate.shenfen_info=
			'出牌阶段,你可以弃6枚"暴怒"标记并选择所有其他角色,对这些角色各造成1点伤害,然后这些角色先各弃置其装备区里的牌,再各弃置四张手牌,最后你将你的武将牌翻面.每阶段限一次'
			lib.skill.shenfen={
				audio:2,
				enable:'phaseUse',
				usable:1,
				filter:function(event,player){
					return player.storage.baonu>=6;
				},
				skillAnimation:'epic',
				animationColor:'metal',
				prepare:function(cards,player){
					player.line(game.players);
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=player){
							game.players[i].animate('target');
						}
					}
				},
				content:function(){
					"step 0"
					player.storage.baonu-=6;
					event.targets=game.players.slice(0);
					event.targets.remove(player);
					event.targets.sort(lib.sort.seat);
					event.targets2=event.targets.slice(0);
					player.turnOver();
					"step 1"
					if(event.targets.length){
						event.targets.shift().damage();
						event.redo();
					}
					"step 2"
					if(event.targets2.length){
						var cur=event.targets2.shift();
						if(cur&&cur.num('he')){
							cur.chooseToDiscard('he',true,4);
						}
						event.redo();
					}
				},
				ai:{
					order:10,
					result:{
						player:function(player){
							var num=0;
							for(var i=0;i<game.players.length;i++){
								if(game.players[i]!=player){
									if(game.players[i].ai.shown==0) return 0;
									num+=ai.get.damageEffect(game.players[i],player,player)>0?1:-1;
								}
							}
							return num;
						}
					}
				}
			}
			lib.skill.jilue_wansha.ai={
				order:8,
				result:{
					player:function(player,target){
						if(player.num('h',function(card){
							return get.tag(card,'damage')&&card.name!='sha';
						})){
							var num=0;
							for(var i=0;i<game.players.length;i++){
								var pl=game.players[i];
								if(pl.hp==1&&pl.num('h')<=2){
									if(pl.isF(player)) num-=0.5;
									else num++;
								}
							}
							return num;
						}
						if(get.maxShaEffect(player)&&get.maxShaEffect(player).hasFriend()){
							if(!player.num('h','sha')) return ;
							if(get.maxShaEffect(player).hp==1&&get.maxShaEffect(player).num('h')<=2) return 1;
						}
					}
				}
			}
			lib.skill.jilue_fangzhu.content=function(){
				"step 0"
				player.chooseTarget('是否弃置一枚"忍",并发动【放逐】？',function(card,player,target){
					return player!=target
				}).ai=function(target){
					var player=_status.event.player;
					var pl=_status.currentPhase;
					if(ai.get.attitude(_status.event.player,target)==0) return 0;
					if(ai.get.attitude(_status.event.player,target)>0){
						if(target.hasSkill('luanji')) return 200;
						if(target.classList.contains('turnedover')) return 100-target.num('h');
						if(player.maxHp-player.hp<3) return -1;
						return 100-target.num('h');
					}
					else{
						var num=0;
						if(target.hasSkill('zaoxian')&&target.storage.tuntian.length>=3&&!target.hasSkill('jixi')) num+=5;
						if(target.hasSkill('hunzi')&&target.hp==1&&!target.hasSkill('yingzi')) num+=5.5;
						if(target.hasSkill('zili')&&target.storage.quanji.length>=3&&!target.hasSkill('paiyi')) num+=6;
						if(target.hasSkill('zhiji')&&target.num('h')==0&&!target.hasSkill('guanxing')) num+=6.5;
						if(target.classList.contains('turnedover')) return -1;
						return (1+target.num('h')+num)/Math.sqrt(get.distance(pl,target,'absolute'))+get.playerRank(target.name)/2;
					}
				}
				"step 1"
				if(result.bool){
					player.storage.renjie--;
					player.updateMarks();
					player.logSkill('jilue_fangzhu',result.targets);
					result.targets[0].draw(player.maxHp-player.hp);
					result.targets[0].turnOver();
				}				
			}
			lib.skill.jilue_fangzhu.ai={
				maixie:true,
				effect:{
					target:function(card,player,target){
						if(get.tag(card,'damage')){
							if(player.hasSkill('jueqing')) return [1,-2];
							if(target.hp<=1) return;
							var hastarget=false;
							var turnfriend=false;
							for(var i=0;i<game.players.length;i++){
								if(ai.get.attitude(target,game.players[i])<0&&!game.players[i].isTurnedOver()){
									hastarget=true;
								}
								if(ai.get.attitude(target,game.players[i])>0&&game.players[i].isTurnedOver()){
									hastarget=true;
									turnfriend=true;
								}
							}
							if(ai.get.attitude(player,target)>0&&!hastarget) return;
							if(!target.hasFriend()) return;
							if(turnfriend||target.hp==target.maxHp) return [0.5,1];
							if(target.hp>1) return [1,1];
						}
					}
				}
			}
			//------------------------------无懈策略----------------------------------//
			lib.card.lebu.ai.wuxie=function(target,card,player,viewer){
				if(target.num('j','bingliang')){
					if(target.hasSkill('fangquan')||target.hasSkill('rekurou')||target.hasSkill('qice')||target.hasSkill('zhanjue')||target.hasSkill('jigong')) return ;
					if((target.hasSkill('zishou')||target.hasSkill('keji'))&&target.num('h')<=5) return 0;
					if(target.num('h')+1<=target.hp) return 0;
				}
			}
			lib.card.bingliang.ai.wuxie=function(target,card,player,viewer){
				if(target.num('j','lebu')){
					if(target.hasSkill('yongsi')||target.hasSkill('tuxi')||target.hasSkill('retuxi')) return ;
					if(target.hasSkill('qice')||target.hasSkill('zhanjue')||target.hasSkill('fangquan')||target.hasSkill('rekurou')||target.hasSkill('jigong')) return 0;
					if(target.num('h')>=player.hp+1) return 0;
				}
			}
			lib.card.wugu.ai.wuxie=function(target,card,player,viewer){
				if(viewer.hasJudgeFirend()&&Math.random()<0.9) return 0;
				if(Math.random()<0.8) return 0;
			}
			lib.card.nanman.ai.wuxie=function(target,card,player,viewer){
				var pl=get.mostProtect(viewer);
				if(ai.get.attitude(viewer,target)>0){
					if(!pl){
						if(viewer.hasJudgeFirend()&&Math.random()<0.8) return 0;
						if(target==viewer&&!viewer.num('h','sha')&&Math.random()<0.5) return ;
						return 0;
					}
					if(pl&&target!=pl) return 0;
				}
				if(ai.get.attitude(viewer,target)<0){
					if(get.mostDamage(viewer)==target&&!pl) return ;
					if(!target.hasSkill('fangzhu')&&!target.hasSkill('rejianxiong')&&!target.hasSkill('jieming')) return 0;
				}
			}
			lib.card.wanjian.ai.wuxie=function(target,card,player,viewer){
				var pl=get.mostProtect(viewer);
				if(ai.get.attitude(viewer,target)>0){
					if(!pl){
						if(viewer.hasJudgeFirend()&&Math.random()<0.65) return 0;
						if(target==viewer&&!viewer.num('h','shan')&&Math.random()<0.7) return ;
						return 0;
					}
					if(pl&&target!=pl) return 0;
				}
				if(ai.get.attitude(viewer,target)<0){
					if(get.mostDamage(viewer)==target&&!pl) return ;
					if(!target.hasSkill('fangzhu')&&!target.hasSkill('rejianxiong')&&!target.hasSkill('jieming')) return 0;
				}
			}
			lib.card.guohe.ai.wuxie=function(target,card,player,viewer){
				if(player==viewer){
					if(player.num('h')-(get.maxUse(player)+player.num('h','wuxie'))>=player.hp+1&&Math.random()>0.7) return ;
				}
				if(target.num('j')&&target.isE(viewer)) return ;
				if(target.get('e','5')&&target.get('e','5').cards>=2) return ;
				if(viewer.hasJudgeFirend()&&Math.random()<0.7) return 0;
				if(target.num('e')&&get.subtype(target.get('e')[0])!='equip4'){
					if(viewer==target&&Math.random()<0.35) return 0;
				}				
				if(target.num('h')>=3) return 0;
			}
			lib.card.shunshou.ai.wuxie=function(target,card,player,viewer){
				if(player==viewer){
					if(player.hp==1) return ;
					if(player.num('h')-(get.maxUse(player)+player.num('h','wuxie'))>=player.hp+1&&Math.random()>0.7) return ;
				}
				if(target.num('j')&&target.isE(viewer)) return ;
				if(target.get('e','5')&&target.get('e','5').cards>=2) return ;
				if(viewer.hasJudgeFirend()&&Math.random()<0.65) return 0;
				if(target==viewer){
					if(target.num('h')<=3) return ;
				}
				if(target.num('e')&&get.subtype(target.get('e')[0])!='equip4'){
					if(Math.random()<0.25) return 0;
				} 
				if(target.num('h')>=4) return 0;
				if(ai.get.attitude(viewer,player)>0&&ai.get.attitude(viewer,target)>0){
					return 0;
				}
			}
			lib.card.taoyuan.ai.wuxie=function(target,card,player,viewer){
				if(target.hp==1) return ;
				if(player==viewer){
					if(player.num('h')-(get.maxUse(player)+player.num('h','wuxie'))>=player.hp+1&&Math.random()>0.7) return ;
				}
				if(viewer.hasJudgeFirend()) return 0;
				if(target.isSafe()) return 0;
			}
			lib.card.wuzhong.ai.wuxie=function(target,card,player,viewer){
				if(player==viewer){
					if(player.hp==1) return ;
					if(player.num('h')-(get.maxUse(player)+player.num('h','wuxie'))>=player.hp+1&&Math.random()>0.7) return ;
				}
				if(player.num('h')>=3&&Math.random()<0.6) return 0;
				if(viewer.hasJudgeFirend()&&Math.random()<0.65) return 0;
			}
			lib.card.juedou.ai.wuxie=function(target,card,player,viewer){
				if(player==viewer){
					if(player.num('h')-(get.maxUse(player)+player.num('h','wuxie'))>=player.hp+1&&Math.random()>0.7) return ;
				}
				if(target.isSafe()) return 0;				
				if(viewer.hasJudgeFirend()&&Math.random()<0.35) return 0;				
			}
			lib.card.jiedao.ai.wuxie=function(target,card,player,viewer){
				if(viewer.hasJudgeFirend()&&Math.random()<0.8) return 0;
				if(player==viewer){
					if(player.num('h')-(get.maxUse(player)+player.num('h','wuxie'))>=player.hp+1&&Math.random()>0.7) return ;
				}
				if(!player.hasCardTarget('sha')&&Math.random()<0.8&&player.isE(viewer)) return ;
				if(Math.random()<0.6) return 0;
			}
			lib.card.huogong.ai.wuxie=function(target,card,player,current,state){
				if(target.isSafe()&&!target.num('e','tengjia')&&!target.isLinked()) return 0;
				if(ai.get.attitude(current,player)>=0&&state>0) return false;
			}
			lib.card.bingliang.ai.result.target=function(player,target){
				var num=-1-target.get('h').length;
				if(target.isTurnedOver()) num/=2;
				var dist=get.distance(player,target,'absolute');
				if(dist<1) dist=1;
				return -1-target.get('h').length/Math.sqrt(dist);
			}
			lib.card.tiesuo.ai.wuxie=function(target,card,player,viewer){
				if(target.num('e','tengjia')) return ;
				if(Math.random()<0.95) return 0;
			}
			//------------------------------基本牌策略----------------------------------//
			lib.card.jiu.ai.result.target=function(player,target){
				if(target&&target.hp<=0&&!target.hasSkill('buqu')) return 2;
				if(lib.config.mode=='stone'&&!player.isMin()){
					if(player.getActCount()+1>=player.actcount) return false;
				}
				var shas=player.get('h','sha');
				if(shas.length>1){
					if(player.num('he','zhuge')) return 0;
					if(!player.getStat().card.sha&&player.hasSkill('mingjian2')) return 0;
					if(!player.getStat().card.sha&&player.hasSkill('tianyi2')) return 0;
					if(player.hasSkill('paoxiao')) return 0;
				}
				var pl=get.maxShaEffect(player);
				if(shas.length){
					var pl=get.maxShaEffect(player);
					if(pl&&pl.isE(player)&&!pl.num('e','baiyin')) return 1;
				}
				return 0;
			}
			lib.card.sha.ai.order=3.8;
			lib.card.sha.content=function(){
				"step 0"
				if(event.skipShan){
					event._result={bool:true};
				}
				else if(event.directHit){
					event._result={bool:false};
				}
				else{
					var next=target.chooseToRespond({name:'shan'});
					next.set('ai',function(){
						var target=_status.event.player;
						var evt=_status.event.getParent();
						var sks=target.get('s');
						if(sks.contains('leiji')||
							sks.contains('releiji')||
							sks.contains('lingbo')||
							sks.contains('tuntian')||
							sks.contains('qingguo')||
							sks.contains('longdan')||
							(evt.player.num('e','hanbing')&&evt.player.isE(target))){
							return 1;
						}
						if(target.num('h')==1&&evt.player.hasSkill('juece')) return -1;
						if(ai.get.damageEffect(target,evt.player,target,evt.card.nature)>=0) return -1;
						if(evt.player.num('h')>=evt.player.hp+2&&evt.player.num('e','guanshi')) return -1;
						if(target.hp>=3&&target.num('h','shan')==1&&!evt.player.hasSkill('jiu')&&!evt.player.hasSkill('reluoyi2')){
							if(evt.player.num('h')>=6){
								if(Math.random()>1-evt.player.num('h')/10) return -1;										
							}
							if(evt.player.num('h')>=4){
								if(evt.player.hasSkill('zhuge_skill')||evt.player.hasSkill('paoxiao')||evt.player.hasSkill('qiangwu')) return -1;
							}
							if(evt.player.num('h')>=4&&evt.player.num('e','qinglong')) return -1;
							if(get.distance(target,evt.player,'absolute')<=2&&get.enemyCount(target)>=3&&Math.random()>0.75) return -1;
						}
						return 1;
					})
					next.autochoose=lib.filter.autoRespondShan;
				}
				"step 1"
				if(result.bool==false){
					event.trigger('shaHit');
				}
				else{
					event.trigger('shaMiss');
					event.responded=result;
				}
				"step 2"
				if(result.bool==false&&!event.unhurt){
					target.damage(get.nature(event.card));
					event.result={bool:true}
					event.trigger('shaDamage');
				}
				else{
					event.result={bool:false}
					event.trigger('shaUnhirt');
				}
			}
			//------------------------------装备牌策略----------------------------------//
			lib.skill.bagua_skill.check=function(event,player){
				if(player.hasSkill('tiandu')||player.hasSkill('leiji')||player.hasSkill('releiji')||player.hasSkill('midao')) return 1;				
				if(_status.currentPhase.num('e','hanbing')) return 1;
				if(ai.get.effect(player,{name:'sha'},_status.currentPhase,player)>0) return 0;
				return 1;
			}	
			lib.card.zhuge.ai.basic={
				equipValue:function(card,player){
					var num=0;
					if((!player.num('h','sha')||!player.hasCardTarget('sha'))&&player.num('h')<=player.hp) return 0;
					if(player.hasCardTarget('sha')&&player.num('h','sha')){
						if(get.cardCount({name:'sha'},player)>=1){
							num+=player.num('h','sha');
							return num*2.5+1.5;
						}
						else return 0;
					}
					return 1;
				}
			}
			lib.skill.hanbing_skill.content=function(){
				"step 0"
				player.choosePlayerCard('是否发动【寒冰剑】？','he',trigger.target,Math.min(2,trigger.target.num('he')),function(button){
					if(player.hasSkill('jiu')||player.hasSkill('tianxianjiu')) return false;
					if(player.hasSkill('reluoyi2')) return false;
					var eff=ai.get.damageEffect(trigger.target,player,player);
					if(ai.get.attitude(player,trigger.target)>0){
						if(eff>=0) return false;
						return 10-ai.get.buttonValue(button);
					}
					if(eff<=0) return ai.get.buttonValue(button);
					if(trigger.target.hp==1) return false;
					if(!trigger.target.num('e')&&trigger.target.hasSkill('shangshi')&&trigger.target.num('h')<=trigger.target.maxHp-trigger.target.hp) return false;
					if(!trigger.target.num('e')&&(trigger.target.hasSkill('relianying')||trigger.target.hasSkill('lianying'))&&trigger.target.num('h')<=2) return false;
					if(_status.event.dialog.buttons.length<2) return -1;
					var num=0;
					for(var i=0;i<_status.event.dialog.buttons.length;i++){
						if(ai.get.buttonValue(_status.event.dialog.buttons[i])>1.5) num++;
					}
					if(num>=2) return ai.get.buttonValue(button)-1.5;
				});
				"step 1"
				if(result.bool){
					trigger.untrigger();
					var cards=[];
					for(var i=0;i<result.buttons.length;i++) cards.push(result.buttons[i].link);
					player.logSkill('hanbing_skill');
					trigger.unhurt=true;
					trigger.target.discard(cards);
				}
			}
			lib.skill.hanbing_skill.ai={
				effect:{
					player:function(card,player,target){
						if(card.name=='sha'&&target.hasSkillTag('maixie')&&target.isE(player)){
							return [1,0,0,-3];
						}
					}
				}
			}
			lib.skill.guding_skill.content=function(){
				player.line(trigger.player,'green');
				trigger.num++;
			}
			lib.card.guding.ai.basic={
				equipValue:function(card,player){
					for(i=0;i<game.players.length;i++){
						if(player.canUse('sha',game.players[i])){
							if(ai.get.attitude(player,game.players[i])<0){
								if(get.distance(player,game.players[i])<=2){
									if(game.players[i].num('h')==0) return 5.2;
								}
							}
						}
					}
					if(player.hasSkill('xinpojun')) return 6;
					return 2;
				}
			}
			lib.card.cixiong.ai.basic.equipValue=function(card,player){
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(get.distance(player,pl)<=2&&pl.isE(player)) return 3;
				}
				return 2;
			}
			lib.skill.cixiong_skill.content=function(){
				"step 0"
				trigger.target.chooseToDiscard().ai=function(card){
					return -ai.get.attitude(trigger.target,player)-ai.get.useful(card)*1.5;
				}
				"step 1"
				if(result.bool==false) player.draw();
			}
			lib.skill.zhangba_skill.check=function(card){
				var player=_status.event.player;
				if(player.hasSkill('lianying')||player.hasSkill('shangshi')||player.hasSkill('relianying')||player.hasSkill('kongcheng')) return 6.1-ai.get.useful(card);
				if(card.name=='sha') return 0;
				var pl=get.maxShaEffect(player);
				if(pl&&pl.hp==1&&pl.num('h')<=2&&!pl.num('e','tengjia')) return 8-ai.get.useful(card);
				return 6-ai.get.useful(card)
			}
			lib.skill.guanshi_skill.content=function(){
				"step 0"
				var next=player.chooseToDiscard('是否发动贯石斧？',2,'he',function(card){
					return _status.event.player.get('e',{subtype:'equip1'}).contains(card)==false;
				});
				next.logSkill='guanshi_skill';
				next.set('ai',function(card){
					var evt=_status.event.getParent();
					if(ai.get.attitude(evt.player,evt._trigger.target)<0){
						if(evt.player.hasSkill('jiu')||
						evt.player.hasSkill('tianxianjiu')||
						player.hasSkill('reluoyi2')||player.hasSkill('luoyi2')||evt._trigger.target.hp==1){
							return 10-ai.get.value(card)
						}
						return 5-ai.get.value(card)
					}
					return -1;
				})
				"step 1"
				if(result.bool){
					trigger.untrigger();
					trigger.trigger('shaHit');
					trigger._result.bool=false;
				}
			}
			lib.card.guanshi.ai.basic={
				equipValue:function(card,player){
					var num=2.5+(player.num('he'))/2.5;
					if(player.hasSkill('jiu')||player.hasSkill('reluoyi2')||player.hasSkill('luoyi2')||player.hasSkill('jiushi')) num++;
					return Math.min(num,5);
				}
			}
			lib.skill.zhuque_skill.check=function(event,player){
				var att=ai.get.attitude(player,event.target);
				if(event.target.isLinked()){
					var num=0;
					for(var i=0;i<game.players.length;i++){
						var pl=game.players[i];
						if(pl.isLinked()){
							if(pl.isF(player)){
								var nh=pl.num('h');
								var nhe=player.num('he');
								if(get.mode()=='identity'){
									if(!player.num('h','tao')&&!player.hasSaveFriend()&&pl.isZZ()&&pl.hp<=1) num-=5;
									if(!player.num('h','tao')&&!player.hasSaveFriend()&&player.isZZ()&&pl.identity=='zhong'&&nh<=2&&pl.hp<=1){
										num-=nhe+1.7;
									} 
								}
								if(get.mode()=='guozhan'){
									if(!player.num('h','tao')&&!player.hasSaveFriend()&&pl.identity==player.identity&&nh<=2&&pl.hp<=1){
										num-=nhe+1.7;
									}
								}
								if(get.mode()=='tongshuai'){		
									if(!player.num('h','tao')&&!player.hasSaveFriend()&&pl.isZZ()&&pl.hp<=1) num-=5; 
								}
								if(pl.num('e','tengjia')) num-=2;
								if(!pl.hasSkillTag('maixie')) num--;
								if(pl.hasSkillTag('maixie')&&pl.hp==1) num--;
							} 
							if(pl.isE(player)){
								if(pl.num('e','tengjia')) num+=2;
								if(!pl.hasSkillTag('maixie')) num++;
								if(pl.hasSkillTag('maixie')&&pl.hp==1) num++;
							}										
						}
					}
					return num;				
				}
				if(event.target.hasSkillTag('nofire')){
					return att>0;
				}
				return att<=0;
			}
			lib.card.fangtian.ai.basic={
				equipValue:function(card,player){
					if(player.num('h')<=3){
						if(player.num('h','sha')==1){
							if(player.num('h',function(card){
								return card.name!='sha'&&player.hasCardTarget(card)
							})+1==player.num('h')){
								return 4.5;
							}
						}
					}
					return 2.5;
				}
			}
			lib.skill.fangtian_skill.ai={
				effect:{
					player:function(card,player,target){
						if(card.name=='tiesuo') return ;
						if(player.num('h')<=3){
							if(player.num('h','sha')==1){
								if(player.num('h')!=1){
									if(player.num('h',function(card){
										return card.name!='sha'&&player.hasCardTarget(card)
									})+1==player.num('h')){
										if(card.name=='sha') return [0,0,0,0]
									}
								}
							}
						}
					}
				}
			}
			//------------------------------锦囊牌策略----------------------------------//
			lib.card.juedou.ai.result.target=function(player,target){
				if(player.num('h','sha')>=2&&player.hasCardTarget('sha')){
					if(player.num('he','zhuge')||player.hasSkill('paoxiao')){
						var num=player.num('h','sha');
						return -1.5+(num-1)*0.5;
					}
				}
				return -1.5;
			}
			lib.card.yiyi.content=function(){
				target.draw(2);
				target.chooseToDiscard(2,'he',true).ai=function(card){
					if(target.hasSkillTag('noe')){
						if(!ui.selected.cards[0]){
							if(get.position(card)=='e'){
								if(player.num('h',{subtype:get.subtype(card)})) return 10; 
								if(get.subtype(card)=='equip1') return 8;
								if(get.subtype(card)=='equip2') return 6;
								if(get.subtype(card)=='equip3') return 4;
								if(get.subtype(card)=='equip4') return 10;
								if(get.subtype(card)=='equip5') return 0.1;
							}
						}
						else if(get.type(card)=='equip') return -1;
						return ai.get.disvalue(card)/2;
					}
					return ai.get.disvalue(card);
				}
			}
			lib.card.guohe.ai.result.target=function(player,target){
				var es=target.get('e');
				var nh=target.num('h');
				var noe=(es.length==0||target.hasSkillTag('noe'));
				var noe2=(es.length==1&&es[0].name=='baiyin'&&target.hp<target.maxHp);
				var noh=(nh==0||target.hasSkillTag('noh'));
				if(noh&&noe) return 0;
				if(noh&&noe2) return 0.01;
				if(!target.num('h')&&target.hp==1&&get.mostDamage(player)==target){
					if(!target.get('e','2')&&!target.get('e','3')) return -0.01;
				}
				var num=0;
				if(target.num('j','lebu')) num-=0.2;
				if(target.isTurnedOver()) num+=0.2;
				if(target.get('e','5')) num+=0.5;
				if(target.get('e','3')) num+=0.3;
				if(target.get('e','2')) num+=0.25;
				if(target.get('e','1')) num+=0.3;
				num-=((target.hp-3)*1.5+(target.num('h')-3)*2)/10;
				num+=get.playerRank(target.name)/15;
				var listMore=['rende','paoxiao','jizhi','zhiheng','qixi','guose','jieyin','qingnang','kanpo','tianyi','luanji','shuangxiong','duanliang','dimeng','jiuchi','qiaobian','beige','retieji','jijiu','bifa','yongsi','mizhao','mingzhe','duwu','zhenwei','xiaoguo','zhendu','duanbing','xuanfeng','yuce','jianying','yijue','renjie','leiji','huomo'];
				var listLess=['kongcheng','lianying','tiaoxin','fangquan','guzheng','shangshi','luoying','qice','zhanjue','tianming'];
				for(var i=0;i<target.skills.length;i++){
					if(listMore.contains(target.skills[i])){
						num+=0.4;
						break;
					}
					if(listLess.contains(target.skills[i])){
						num-=0.5;
						break;
					}
				}
				if(ai.get.attitude(player,target)<=0) return target.num('he')?-1.5-num:1.5;
				var js=target.get('j');
				if(js.length){
					var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
					if(js.length==1&&ai.get.effect(target,jj,target,player)>=0){
						return -3;
					}
					return 5;
				}
				if(num<-1.5) num=0;
				return -1.5-num;
			}
			lib.card.huogong.ai.basic.order=6;
			lib.card.huogong.ai.target=function(player,target){
				if(target.hasSkill('huogong2')||target.num('h')==0) return 0;
				if(player.hasSkill('lianying')||player.hasSkill('relianying')||player.hasSkill('jingce')||player.hasSkill('shangshi')) return -1;
				if(player.num('h')<=2) return 0;
				var num=0;
				var spade=player.num('h',{suit:'spade'});
				var heart=player.num('h',function(card){
					return get.suit(card)=='heart'&&card.name!='huogong'
				});
				var club=player.num('h',{suit:'club'});
				var diamond=player.num('h',function(card){
					return get.suit(card)=='diamond'&&card.name!='huogong'
				});
				num+=spade+heart+club+diamond;
				if(num<2) return 0;
				if(target==player){
					if(typeof _status.event.filterCard=='function'&&
						_status.event.filterCard({name:'huogong'})){
						return -1.5;
					}
					if(_status.event.skill){
						var viewAs=get.info(_status.event.skill).viewAs;
						if(viewAs=='huogong') return -1.5;
						if(viewAs&&viewAs.name=='huogong') return -1.5;
					}
					return 0;
				}
				return -1.5;
			}
			lib.card.taoyuan.ai.basic.order=function(skill,player){
				if(get.mostDamage(player)&&get.mostDamage(player).hp==1) return 3;
				return 5;
			}
			lib.card.taoyuan.ai.result.target=function(player,target){
				return (target.hp<target.maxHp&&ai.get.recoverEffect(target,player)>0)?2:0;
			}
			lib.card.tiesuo.ai.result.target=function(player,target){				
				if(target.isLinked()) return 1;
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(ai.get.attitude(player,game.players[i])<=-1&&!game.players[i].isLinked())
					num++;
				}
				if(num<=1) return 0;
				if(ui.selected.targets.length){
					if(target.num('e','tengjia')) return -3;
					return -1;
				} 
				if(player.num('h',{name:'sha',nature:'fire'})||player.num('h',{name:'sha',nature:'thunder'})){
					if(target==get.maxShaEffect(player)&&!get.maxShaEffect(player).isLinked()) return -3;
				}
				return -1;
			}
			lib.card.nanman.ai.basic.order=function(skill,player){
				if(!player.isZZ()) return 9;
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(pl.identity=='zhong'&&pl.num('h')<=2&&pl.hp==1) return 1.5;
				}
			}
			lib.card.nanman.ai.result.target=function(player,target){
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].ai.shown==0) num++;
				}
				if(num>1&&player.identity=='fan') return 0;
				var nh=target.num('h');
				if(get.mode()=='identity'){
					if(target.isZZ()&&nh<=2&&target.hp<=1&&!player.num('h','tao')&&!player.hasSaveFriend()) return -100;
					if(!player.num('h','tao')&&!player.hasSaveFriend()&&player.isZZ()&&target.identity=='zhong'&&nh<=2&&target.hp<=1){
						var nhe=player.num('he');
						return -nhe-1.7;
					} 
				}
				if(get.mode()=='guozhan'){
					if(!player.num('h','tao')&&!player.hasSaveFriend()&&target.identity==player.identity&&nh<=2&&target.hp<=1){
						var nhe=player.num('he');
						return -nhe-1.7;
					}
				}
				if(get.mode()=='tongshuai'){
					if(target.isZZ()&&nh<=2&&target.hp<=1&&!player.num('h','tao')&&!player.hasSaveFriend()) return -100;
				}
				if(nh==0){
					if(target.identity=='fan'&&target.isE(player)) return -3.5;
					return -2;
				} 
				if(nh==1) return -1.7
				return -1.5;
			}
			lib.card.wanjian.ai.basic.order=function(skill,player){
				if(!player.isZZ()) return 9;
				for(var i=0;i<game.players.length;i++){
					var pl=game.players[i];
					if(pl.identity=='zhong'&&pl.num('h')<=2&&pl.hp==1) return 1.5;
				}
			}
			lib.card.wanjian.ai.result.target=function(player,target){
				var num=0;
				for(var i=0;i<game.players.length;i++){
					if(game.players[i].ai.shown==0) num++;
				}
				if(num>1&&player.identity=='fan') return 0;
				var nh=target.num('h');
				if(get.mode()=='identity'){
					if(target.isZZ()&&nh<=2&&target.hp<=1&&!player.num('h','tao')&&!player.hasSaveFriend()) return -100;
					if(!player.num('h','tao')&&!player.hasSaveFriend()&&player.isZZ()&&target.identity=='zhong'&&nh<=2&&target.hp<=1){
						var nhe=player.num('he');
						return -nhe-1.7;
					} 
				}
				if(get.mode()=='guozhan'){
					if(!player.num('h','tao')&&!player.hasSaveFriend()&&target.identity==player.identity&&nh<=2&&target.hp<=1){
						var nhe=player.num('he');
						return -nhe-1.7;
					}
				}
				if(get.mode()=='tongshuai'){
					if(target.isZZ()&&nh<=2&&target.hp<=1&&!player.num('h','tao')&&!player.hasSaveFriend()) return -100;
				}
				if(nh==0){
					if(target.identity=='fan'&&target.isE(player)) return -3.5;
					return -2;
				}
				if(nh==1) return -1.7
				return -1.5;
			}
			lib.card.jiedao.ai.result.target=function(player,target){
				if(!ui.selected.targets.length){
					if(target.num('h')>=4&&target.hasCardTarget('sha')){
						if(!player.hasShaTarget()) return 0.5;
						return 0.8;
					}
					return -1.5;
				}
				if(ui.selected.targets.length==1){
					return ai.get.effect(target,{name:'sha'},ui.selected.targets[0],target);
				}
			}
			//------------------------------技能策略----------------------------------//
			lib.skill.qiaoshiAttention={
				filter:function(){return false},
				ai:{
					effect:{
						player:function(card,player){
							if(_status.event.skill=='zhiheng') return;
							if(_status.event.skill=='junxing') return;
							if(_status.event.skill=='xinjujian') return;
							if(_status.currentPhase!=player) return;
							if(_status.dying) return ;
							if(player.hasSkill('jiu')) return ;
							var pl=get.skillOwner('qiaoshi');
							if(!pl||!pl.isF(player)||pl==_status.currentPhase) return ;
							if(player.num('h')>player.hp) return ;
							if(card.name=='shunshou'||card.name=='wuzhong'||card.name=='yuanjiao') return;
							if(player.hasSkill('biyue')||player.hasSkill('bingyi')){
								if(player.num('h')==pl.num('h')-1){
									if(card.name!='wuzhong'||card.name!='yuanjiao'||card.name!='lebu'||card.name!='bingliang') return [1,-2]
								}
							}
							if(player.num('h')==pl.num('h')){
								if(card.name!='wuzhong'||card.name!='yuanjiao'||card.name!='lebu'||card.name!='bingliang') return [1,-2]
							} 
							if(player.num('h')>pl.num('h')){
								if(player.num('h')-get.maxUse(player)>=pl.num('h')) return [1,2]
							}
						}
					}										
				}
			}
			lib.skill.guzhengAttention={
				filter:function(){return false},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(_status.currentPhase!=player) return;
							if(player.hasSkill('zhanjue')||player.hasSkill('qice')) return;
							var pl=get.skillOwner('guzheng');
							if(!pl||!pl.isF(player)||pl==_status.currentPhase) return ;
							if(get.subtype(card)=='equip1'||get.subtype(card)=='equip4'){
								return [0,0,0,0];
							}
						}
					}										
				}
			}
			lib.skill.zuodingAttention={
				filter:function(){return false},
				ai:{
					effect:{
						player:function(card,player,target){
							var pl=get.skillOwner('zuoding');
							if(_status.currentPhase!=player) return;
							if(!pl||!pl.isE(player)||pl==_status.currentPhase) return ;
							if(target==player) return ;
							if(pl.hasSkill('zuoding2')) return ;
							if(player.num('h',function(card){
								return get.tag(card,'damage')&&player.hasCardTarget(card)
							})){
								if(!card.viewAs){
									if(get.suit(card)=='spade'&&target!=player&&!get.tag(card,'damage')) return [1,0,0,0];
								}
								if(get.suit(card)=='spade'&&target!=player) return [1,0,0,0];
							}
						}
					}
				}
			}
			lib.skill.kaikangAttention={
				filter:function(){return false},
				ai:{
					effect:{
						target:function(card,player,target){
							var pl=get.skillOwner('kaikang');						
							if(!pl) return ;
							if(!target.isE(pl)&&get.distance(pl,target)<=1){
								if(card.name=='sha') return [1,0.7];
							}
						}
					}
				}
			}
			lib.skill.buyiAttention={
				filter:function(){return false},
				ai:{
					effect:{
						player:function(card,player,target){
							var pl=get.skillOwner('buyi');						
							if(!pl||player.isE(pl)) return ;
							if(_status.currentPhase!=player) return;
							if(player.hp<=2&&player.num('h')<=player.hp&&player.canbeSha()){
								if(get.subtype(card)!='equip3'&&get.subtype(card)!='equip2'&&card.name!='wuzhong'&&card.name!='yuanjiao'&&card.name=='shunshou'&&get.type(card)!='basic'){
									return [0,0,0,0];
								}
							}
						}
					}
				}
			}
			lib.skill.longyinAttention={
				filter:function(){return false},
				ai:{
					effect:{
						player:function(card,player,target){
							var guanping=get.skillOwner('longyin');
							if(!guanping||!guanping.isBF(player)||guanping.num('h')<2) return ;
							if(player.num('h',{name:'sha',color:'red'})){
								if(card.name=='sha'&&get.color(card)=='black') return [0,0,0,0]
							}
						}
					}
				}
			}
			lib.skill.global.push('qiaoshiAttention')
			lib.skill.global.push('guzhengAttention')
			lib.skill.global.push('zuodingAttention')
			lib.skill.global.push('kaikangAttention')
			lib.skill.global.push('buyiAttention')
			lib.skill.global.push('longyinAttention')
			//------------------------------出牌策略----------------------------------//
			lib.skill.tiesuoAttention={
				filter:function(){return false},
				ai:{
					effect:{
						target:function(card,player,target){
							if(get.tag(card,'fireDamage')||get.tag(card,'thunderDamage')){
								var num=0;
								for(var i=0;i<game.players.length;i++){
									var pl=game.players[i];
									if(pl.isLinked()){
										if(pl.isBF(player)){
											var nh=pl.num('h');
											var nhe=player.num('he');
											if(get.mode()=='identity'){
												if(!player.num('h','tao')&&!player.hasSaveFriend()&&pl.isZZ()&&pl.hp<=1) num-=5;
												if(!player.num('h','tao')&&!player.hasSaveFriend()&&player.isZZ()&&pl.identity=='zhong'&&nh<=2&&pl.hp<=1){
													num-=nhe+1.7;
												} 
											}
											if(get.mode()=='guozhan'){
												if(!player.num('h','tao')&&!player.hasSaveFriend()&&pl.identity==player.identity&&nh<=2&&pl.hp<=1){
													num-=nhe+1.7;
												}
											}
											if(get.mode()=='tongshuai'){		
												if(!player.num('h','tao')&&!player.hasSaveFriend()&&pl.isZZ()&&pl.hp<=1) num-=5; 
											}
											if(pl.num('e','tengjia')) num-=2;
											if(!pl.hasSkillTag('maixie')) num--;
											if(pl.hasSkillTag('maixie')&&pl.hp==1) num--;
										} 
										if(pl.isE(player)){
											if(pl.num('e','tengjia')) num+=2;
											if(!pl.hasSkillTag('maixie')) num++;
											if(pl.hasSkillTag('maixie')&&pl.hp==1) num++;
										}										
									}
								}
								if(num==0)  num=1;
								if(target.isLinked()){
									if(target.isE(player)) return num;
									else return -num;
								} 
							}
						}
					}
				}
			}
			lib.skill.saveCard={
				filter:function(){return false},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(_status.currentPhase!=target) return;
							if(target.num('h')>target.hp) return;
							if(target.hasSkill('zhanjue')||target.hasSkill('qice')) return ;
							if(get.subtype(card)=='equip1'){
								if(player.getStat().card.sha&&!player.hasSkill('paoxiao')&&!player.hasSkill('qiangwu')&&card.name!='zhuge') return [0,0,0,0];
								if(!target.num('h','sha')||!target.hasShaTarget()) return [0,0,0,0]
							}
							if(get.subtype(card)=='equip4'){
								if(!target.num('h','sha')&&!target.num('h','shunshou')&&!target.num('h','bingliang')) return [0,0,0,0]
							}
						}
					}
				}
			}
			lib.skill.weakHit={
				filter:function(){return false},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(get.playerRank(target.name)>=4) return ;
							if(get.playerRank(target.name)>=3&&Math.random()<0.4) return ;
							if(get.tag(card,'damage')){
								if(player.identity=='fan'&&target.identity=='fan'&&target.num('h')<=2&&target.hp==1&&game.zhu.hp<=1&&game.zhu.num('h')<=2){
									if(player.num('e','zhuge')&&player.num('h','sha')>=3){
										if(player.canUse('sha',game.zhu)) return ;
										if(get.distance(player,game.zhu)<=2){
											if(game.zhu.get('e','2')&&game.zhu.get('e','2').name!='baiyin') return ;
											return [0,1,1,3];
										} 
									}									
								}								
							}								
						}
					}
				}
			}
			lib.skill.gudingAttention={
				filter:function(){return false},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(player.num('e','guding')){
								if(target.num('h')==1){
									if(card.name=='guohe'||card.name=='shunshou') return [1,-2]
								}
							}
						}
					}
				}
			}
			lib.skill.damageAttention={
				filter:function(){return false},
				ai:{
					effect:{
						target:function(card,player,target,current){
							if(get.tag(card,'damage')){
								if(!target.isE(player)) return ;
								var num=player.num('h','sha');
								if(player.storage.qiangwu&&player.num('h',function(card){
									return card.name=='sha'&&card.number>player.storage.qiangwu;
								})>=2) return [num,0];
								if((player.num('he','zhuge')||player.hasSkill('paoxiao'))&&player.num('h','sha')>=2) return [num,0];
							}
						}
					}
				}
			}
			lib.skill.global.push('tiesuoAttention')
			lib.skill.global.push('saveCard')
			lib.skill.global.push('weakHit')
			lib.skill.global.push('gudingAttention')
			lib.skill.global.push('damageAttention')
			//------------------------------武将解禁----------------------------------//
			lib.config.forbid.shift();
			lib.config.forbidai=['zuoci','shibing'];
			lib.config.forbiddouble.push('kelejiabing');
			lib.config.forbidall=[];
			lib.config.forbidpack=[];
			//------------------------------音效修改----------------------------------//
			for(var i in lib.character){
				if(lib.character[i].mode&&lib.character[i].mode.contains(lib.config.mode)==false) continue;
				if(!lib.character[i][4].contains('die_audio')) lib.character[i][4].push('die_audio');
			}
			for(var i in lib.skill){
				if(!lib.skill[i].audio||typeof lib.skill[i].audio=='number'){
					lib.skill[i].audio=2;
				}
			}
			game.trySkillAudio=function(skill,player,directaudio){
				game.broadcast(game.trySkillAudio,skill,player,directaudio);
				var info=get.info(skill);
				if(!info) return;
				if((!info.direct||directaudio)&&lib.config.background_speak&&
					(!lib.skill.global.contains(skill)||lib.skill[skill].forceaudio)){
					var audioname=skill;
					var audioinfo=info.audio;
					if(typeof audioinfo=='string'){
						if(audioinfo.indexOf('ext:')==0){
							audioinfo=audioinfo.split(':');
							if(audioinfo.length==3){
								if(audioinfo[2]=='true'){
									game.playAudio('..','extension',audioinfo[1],audioname);
								}
								else{
									audioinfo[2]=parseInt(audioinfo[2]);
									if(audioinfo[2]){
										game.playAudio('..','extension',audioinfo[1],audioname+Math.ceil(audioinfo[2]*Math.random()));
									}
								}
							}
							return;
						}
						else{
							audioname=audioinfo;
							if(lib.skill[audioinfo]){
								audioinfo=lib.skill[audioinfo].audio;
							}
						}
					}
					else if(Array.isArray(audioinfo)){
						audioname=audioinfo[0];
						audioinfo=audioinfo[1];
					}
					if(Array.isArray(info.audioname)&&player){
						if(info.audioname.contains(player.name)){
							audioname+='_'+player.name;
						}
						else if(info.audioname.contains(player.name1)){
							audioname+='_'+player.name1;
						}
						else if(info.audioname.contains(player.name2)){
							audioname+='_'+player.name2;
						}
					}
					if(typeof audioinfo=='number'){
						var num=lib.storage[audioname+'audio']||1;
						game.playAudio('skill',audioname+num);
						num++;
						if(num>audioinfo) num=1;
						game.save(audioname+'audio',num);
					}
					else if(audioinfo){
						game.playAudio('skill',audioname);
					}
					else if(lib.config.background_ogg&&info.audio!==false){
						game.playSkillAudio(audioname);
					}
				}
			}
			//------------------------------特效修改----------------------------------//
			for(var i in lib.skill){
				if(lib.skill[i].mode&&lib.skill[i].mode.contains(lib.config.mode)==false) continue;
				if(lib.skill[i].skillAnimation==true){
					lib.skill[i].skillAnimation='epic';
				}
			}
			//------------------------------卖血流----------------------------------//
			lib.skill.fankui.ai.maixie=true
			lib.skill.refankui.ai.maixie=true
			lib.skill.ganglie.ai.maixue=true
			lib.skill.reganglie.ai.maixue=true
			lib.skill.beige.ai.maixue=true
			lib.skill.tuntian.ai.maixue=true			
			lib.skill.xinenyuan.ai.maixie=true
			lib.skill.shangshi.ai.maixie=true
			lib.skill.zhiyu.ai.maixue=true			
        })
		//------------------------------武将修改----------------------------------//
		if(config.liuzan){
			delete lib.skill.fenyin.usable;
		}
		if(config.quancong){
			lib.arenaReady.push(function(){
				if(lib.character.quancong) lib.character.quancong[3]=['zhenzhan']
				lib.translate.zhenzhan='振赡';
				lib.translate.zhenzhan2='振赡';
				lib.translate.changeH='振赡';
				lib.translate.zhenzhan_info='每名角色的回合限一次,每当你需要使用或打出一张基本牌时,你可以与一名手牌数少于你的角色交换手牌.若如此做,视为你使用或打出了此牌.'
				lib.skill.zhenzhan={
					group:['zhenzhan2'],
					enable:'chooseToUse',
					filter:function(event,player){
						var num=0;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].num('h')>=player.num('h')) num++;
						}
						if(num==game.players.length) return false;
						if(player.hasSkill('shibei2')) return false;
						return event.parent.name!='_wuxie'&&player.num('h')>0;
					},
					chooseButton:{
						dialog:function(event,player){
							var list=['sha','sha','sha','jiu','tao'];
							var list2=[];
							var nature=['','thunder','fire','',''];
							for(var i=0;i<list.length;i++){
								list2.push(['基本','',list[i],nature[i]]);
							}
							return ui.create.dialog('振赡',[list2,'vcard']);
						},
						filter:function(button,player){
							var trigger=_status.event.getParent();	
							return trigger.filterCard({name:button.link[2]},player,trigger);
						},
						backup:function(links,player){
							return {
								filterCard:function(){return false},
								selectCard:-1,
								audio:2,
								popname:true,
								viewAs:{name:links[0][2],nature:links[0][3]},
								onuse:function(result,player){
									player.useSkill('changeH');
								}
							}
						},
						check:function(button,player){
							var player=_status.event.player;
							if(_status.dying&&ai.get.attitude(player,_status.dying)<=0) return 0;
							var list=[];
							for(var i=0;i<game.players.length;i++){
								var pl=game.players[i];
								if(ai.get.gainEffect(player,pl)>0){
									list.push(pl);
								}
							}
							list.sort(function(a,b){
								return ai.get.gainEffect(player,b)-ai.get.gainEffect(player,a)
							});
							if(player.hp<=2||!player.hasCardTarget('sha')) return (button.link[2]=='tao')?1:0.01;
							if(list[0].num('h','sha')) return (button.link[2]=='jiu')?1:0.01;
							return (button.link[2]=='sha'&&button.link[3]=='fire')?1:0.01;
						},
						prompt:function(links,player){
							return '振赡:请选择'+get.translation(links[0][2])+'的目标';
						}
					},
					ai:{
						expose:0.3,
						order:6,
						save:true,				
						result:{
							threaten:1.5,
							player:function(player){
								if(_status.dying&&ai.get.attitude(player,_status.dying)>0) return 1;
								if(!player.isDamaged()&&!player.hasCardTarget('sha')) return 0;
								for(var i=0;i<game.players.length;i++){
									if(ai.get.gainEffect(player,game.players[i])>0&&game.players[i].num('h')<player.num('h')) return 1;
								}
								return 0;
							}
						}
					}
				}
				lib.skill.changeH={
					audio:['yaoming',2],
					filter:function(){return false;},
					content:function(){
						'step 0'
						var next=player.chooseTarget('振赡:请选择交换手牌的目标',true,function(card,player,target){
							return target.num('h')<player.num('h')
						})
						next.ai=function(target){
							return ai.get.gainEffect(player,target);
						}
						'step 1'
						event.cards0=result.targets[0].get('h');
						event.cards1=player.get('h');
						event.target=result.targets[0];
						event.target.lose(event.cards0,ui.special);
						player.lose(event.cards1,ui.special);
						'step 2'
						event.target.gain(event.cards1);
						player.gain(event.cards0);
						event.target.$give(event.cards0.length,player);
						player.$give(event.cards1.length,event.target);
						'step 3'
						player.addTempSkill('shibei2','phaseAfter');
					}
				}
				lib.skill.zhenzhan2={
					audio:['yaoming',2],
					trigger:{player:'chooseToRespondBegin'},
					priority:10,
					filter:function(event,player){
						if(player.hasSkill('shibei2')) return false;
						return _status.currentPhase!==player&&player.num('h')>0;
					},
					direct:true,
					content:function(){
						"step 0"
						var next=player.chooseTarget('振赡:请选择交换手牌的目标',function(card,player,target){
							return target!=player&&target.num('h')<player.num('h');
						})
						next.ai=function(target){
							return ai.get.gainEffect(player,target);
						}
						'step 1'
						if(result.bool){
							player.logSkill('zhenzhan',result.targets[0]);
							var target=result.targets[0];
							var cards0=target.get('h');
							var cards1=player.get('h');
							target.lose(cards0);
							player.lose(cards1);
							target.gain(cards1);
							player.gain(cards0);
							target.$give(cards0.length,player);
							player.$give(cards1.length,target);
						}
						else{
							event.finish();
						}
						'step 2'
						if(result.bool){                                  
							trigger.untrigger();
							trigger.responded=true;
							if(trigger.filterCard({name:'shan'}))
							trigger.result={bool:true,card:{name:'shan'}};
							else trigger.result={bool:true,card:{name:'sha'}};
							player.addTempSkill('shibei2','phaseAfter');
						}							
					}
				}
			})
		}
		if(config.re_bulianshi){
			lib.arenaReady.push(function(){
				lib.skill.anxu={
					enable:'phaseUse',
					usable:1,
					multitarget:true,
					filterTarget:function(card,player,target){
						if(player==target) return false;
						var num=target.num('h');
						if(ui.selected.targets.length){
							return num<ui.selected.targets[0].num('h');
						}
						for(var i=0;i<game.players.length;i++){
							if(num>game.players[i].num('h')) return true;
						}
						return false;
					},
					selectTarget:2,
					content:function(){
						var gainner,giver;
						if(targets[0].num('h')<targets[1].num('h')){
							gainner=targets[0];
							giver=targets[1];
						}
						else{
							gainner=targets[1];
							giver=targets[0];
						}
						var card=giver.get('h').randomGet();
						gainner.gain(card,'give');
						giver.$give(card,gainner);
						if(get.suit(card)!='spade') player.draw();
					},
					ai:{
						order:10.5,
						threaten:2,
						result:{
							target:function(player,target){
								var num=target.num('h');
								var att=ai.get.attitude(player,target);
								if(ui.selected.targets.length==0){
									if(att>0) return -1;
									for(var i=0;i<game.players.length;i++){
										var num2=game.players[i].num('h');
										var att2=ai.get.attitude(player,game.players[i]);
										if(att2>=0&&num2<num) return -1;
									}
									return 0;
								}
								else{
									return 1;
								}
							},
							player:0.01
						}
					}
				}
				lib.translate.anxu_info='出牌阶段限一次,你可以选择两名手牌数不相等的其它角色,令手牌少的角色获得手牌多的角色的一张手牌,然后若此牌花色不为黑桃,你摸一张牌'
			})
		}
		if(config.old_fuhuanghou){
			lib.arenaReady.push(function(){
				lib.translate.qiuyuan_info='当你成为【杀】的目标时，你可以令另一名有手牌的其他角色交给你一张手牌，然后若此牌不为【闪】，则此角色也成为此【杀】的目标。';
				lib.translate.zhuikong_info='一名其他角色的回合开始时，若你已受伤，你可以与该角色拼点，若你赢，该角色跳过其出牌阶段；若你没赢，其与你距离为一直到回合结束。'
				lib.skill.qiuyuan.trigger={target:'shaBegin'};
				lib.skill.qiuyuan.content=function(){
					"step 0"
					player.chooseTarget('是否发动【求援】？',function(card,player,target){
						return target!=player&&_status.event.getTrigger().player.canUse('sha',target,false)&&target.num('h');
					}).set('ai',function(target){
						var trigger=_status.event.getTrigger();
						var player=_status.event.player;
						return ai.get.effect(target,trigger.card,trigger.player,player)+0.1;
					});
					"step 1"
					if(result.bool){
						var target=result.targets[0];
						player.logSkill('qiuyuan',target);
						event.target=target;
						target.chooseCard('请交给'+get.translation(player)+
						'一张牌',true).set('ai',function(card){
							return ai.get.unuseful(card);
						});
						game.delay();
					}
					else{
						event.finish();
					}
					"step 2"
					player.gain(result.cards);
					event.target.$give(result.cards,player);
					if(result.cards[0].name!='shan'){
						trigger.targets.push(event.target);
						game.log(event.target,'成为了额外目标');
					}
					game.delay();
				}
				lib.skill.zhuikong.content=function(){
					"step 0"
					player.chooseToCompare(trigger.player);
					"step 1"
					if(result.bool){
						trigger.player.skip('phaseUse');
					}
					else{
						trigger.player.addTempSkill('zhuikong2','phaseEnd');
						trigger.player.storage.zhuikong=player;
					}
				}
				lib.skill.zhuikong2={
					mod:{
						targetInRange:function(card,player,target,now){
							if(player.storage.zhuikong==target) return true;
						}
					}
				}
			})
		}				
		if(config.old_caochong){
			lib.arenaReady.push(function(){
				lib.translate.renxin_info='当一名其它角色濒死时，你可以将自己的武将牌翻面并将所有手牌交给该角色，然后其回复一点体力。';
				lib.skill.renxin={
					trigger:{global:'dying'},
					audio:2,
					priority:6,
					filter:function(event,player){
						console.log(event.player.name);
						if(event.player==player) return false;
						return event.player.hp<=0&&player.num('h')>0;
					},
					check:function(event,player){
						return ai.get.attitude(player,event.player)>=3;
					},
					content:function(){
						player.turnOver();
						player.$give(player.num('h'),trigger.player);
						player.line(trigger.player,'green');
						trigger.player.gain(player.get('h'));
						trigger.player.recover();
					},
					ai:{
						expose:0.5
					}
				}
			})
		}
		if(config.sp_sunshangxiang){
			lib.arenaReady.push(function(){
				if(lib.character.sp_sunshangxiang){
					lib.character.sp_sunshangxiang[3]=['liangzhu','fanxiang']
				}
				lib.skill.liangzhu={
					audio:2,
					trigger:{global:'recoverAfter'},
					filter:function(event,player){
						return _status.currentPhase==event.player;
					},
					direct:true,
					content:function(){
						'step 0'
						player.chooseControl('摸1张牌','令其摸2张牌','cancel').ai=function(){
							if(ai.get.attitude(player,trigger.player)>=3) return '令其摸2张牌';
							return '摸1张牌';
						}
						'step 1'
						if(result.control=='摸1张牌'){
							player.logSkill('liangzhu');
							player.draw();
						}
						if(result.control=='令其摸2张牌'){
							player.logSkill('liangzhu',trigger.player);
							trigger.player.draw(2);
							player.storage.lz.push(trigger.player);
						}
					},
					init:function(player){
						player.storage.lz=[];
					},
					ai:{
						expose:0.2
					}
				}
				lib.skill.fanxiang={
					skillAnimation:'epic',
					trigger:{player:'phaseBegin'},
					forced:true,
					unique:true,
					mark:true,
					filter:function(event,player){
						if(player.storage.fx) return false;
						for(var i=0;i<game.players.length;i++){
							var pl=game.players[i];
							if(player.storage.lz.contains(pl)&&pl.isDamaged()) return true;
						}
						return false;
					},
					content:function(){
						player.unmarkSkill('fanxiang');
						player.removeSkill('liangzhu');
						player.addSkill('xiaoji');
						player.gainMaxHp();
						player.recover();
						player.storage.fx=true;
					},
					intro:{
						content:'limited'
					}
				}
				lib.translate.liangzhu_info='一名角色在其出牌阶段回复体力时,你可以选择一项:摸一张牌,或者令该角色摸2张牌'
				lib.translate.fanxiang='返乡';
				lib.translate.fanxiang_info='回合开始时,若场上至少有一名受伤的角色,且你曾经发动过【良助】令其摸牌,则你增加一点体力上限,回复一点体力.失去【良助】并获得【枭姬】';
			})
		}
		if(config.zhuran){
			lib.arenaReady.push(function(){
				lib.skill.danshou={
					trigger:{source:'damageEnd'},
					priority:9,
					content:function(){
						"step 0"
						player.draw();
						"step 1"
						while(_status.event.name!='phase'){
							_status.event=_status.event.parent;
						}
						_status.event.finish();
						_status.event.untrigger(true);
					},
					ai:{
						effect:{
							player:function(card,player,target){
								if(get.tag(card,'damage')&&card.name!='huogong'){
									if(target.hasSkillTag('maixie')) return [1,1,1,-2]
									return [1,1]
								}
							}
						}
					}
				}
				lib.translate.danshou_info='每当你造成一次伤害后,你可以摸一张牌,若如此做,终止一切结算,当前回合结束'
			})
		}
		if(config.wangyi){
			lib.arenaReady.push(function(){
				lib.skill.zhenlie={
					audio:2,
					trigger:{player:'judge'},
					check:function(event,player){
						var judge=event.judge(player.judging[0]);
						if(judge>=0) return 0;
						return 1;
					},
					content:function(){
						"step 0"
						var judge=trigger.judge(player.judging[0]);	
						"step 1"
						event.card=get.cards()[0];
						event.node=event.card.copy('thrown','center','thrownhighlight',ui.arena).animate('start');
						ui.arena.classList.add('thrownhighlight');
						game.addVideo('thrownhighlight1');
						game.addVideo('centernode',null,get.cardInfo(event.card));
						"step 2"
						if(trigger.player.judging[0].clone){
							trigger.player.judging[0].clone.delete();
						}
						trigger.player.judging[0]=event.card;
						game.delay();
					}
				}
				lib.skill.miji={
					audio:2,
					trigger:{player:['phaseBegin','phaseEnd']},
					filter:function(event,player){
						return player.hp<player.maxHp;
					},
					direct:true,
					content:function(){
						'step 0'
						player.judge(function(card){
							return get.color(card)=='black'?1:-1;
						})
						'step 1'
						if(result.bool){
							var cards=[];
							for(var i=0;i<player.maxHp-player.hp;i++){
								cards.push(ui.cardPile.childNodes[i]);
							}
							event.cards=cards;
							var dialog=ui.create.dialog('秘计:选择一个目标',cards,'hidden');
							dialog.classList.add('noselect');
							player.chooseTarget(true,dialog).ai=function(target){
								return ai.get.gainEffect(player,target)
							}
						}
						'step 2'
						if(result.bool){
							var target=result.targets[0];
							player.logSkill('miji',target);
							target.gain(event.cards,'draw');
						}
					},
					ai:{
						maixie:true,
						threaten:function(player,target){
							if(target.hp==1) return 3;
							if(target.hp==2) return 1.5;
							return 0.5;
						},
						effect:{
							target:function(card,player,target){
								if(!target.hasFriend()) return;
								if(get.tag(card,'damage')){
									if(target.hp==4) return [0.6,2];
									if(target.hp==3) return [0.7,1.7];
									if(target.hp==2) return [1,0.2];
								}
								if(get.tag(card,'recover')&&player.hp>=player.maxHp-1&&_status.currentPhase==target) return [0,0];
							}
						}
					}
				}
				lib.translate.zhenlie_info='在你的判定牌生效前,你可以翻开牌顶的一张牌代替之'
				lib.translate.miji_info='回合开始/结束阶段开始时,你可以进行一次判定,若为黑色,你可以观看牌堆顶的X张牌,然后将这些牌交给一名角色'
				
			})
		}
		if(config.madai=='新马岱'){
			lib.arenaReady.push(function(){				
				lib.skill.qianxi={
					audio:2,
					trigger:{player:'phaseBegin'},
					direct:true,
					content:function(){
						'step 0'
						player.draw();
						player.chooseToDiscard(true,'he').ai=function(card){
							var num=0;
							if(get.color(card)=='red') num++;
							return 10-ai.get.value(card)+num;
						}
						"step 1"
						event.color=get.color(result.cards[0]);
						player.chooseTarget(function(card,player,target){
							return player!=target&&get.distance(player,target)<=1;
						},true).ai=function(target){
							if(!target.num('h')) return 0;
							if(target.isF(player)) return 0;
							if(target.hasSkill('jijiu')) return 100;
							return ai.get.effect(target,{name:'sha'},player);
						}
						"step 2"
						if(result.bool&&result.targets.length){
							player.logSkill('qianxi',result.targets[0]);
							result.targets[0].storage.color=event.color;
							result.targets[0].addSkill('qianxi2');
						}
					}
				}
				lib.translate.qianxi_info='回合开始时,你可以摸一张牌,弃置一张牌.然后你须指定距离一以内的一名其它角色,该角色不能使用或打出与你弃置的牌颜色相同的牌'
				lib.skill.qianxi2={
					trigger:{global:'phaseAfter'},
					forced:true,
					mark:true,
					audio:false,
					popup:false,
					content:function(){
						player.removeSkill('qianxi2');
						delete player.storage.color;
					},
					mod:{
						cardEnabled:function(card,player){
							if(get.color(card)==player.storage.color) return false;
						},
						cardUsable:function(card,player){
							if(get.color(card)==player.storage.color) return false;
						},
						cardRespondable:function(card,player){
							if(get.color(card)==player.storage.color) return false;
						},
						cardSavable:function(card,player){
							if(get.color(card)==player.storage.color) return false;
						}
					},
					intro:{
						content:'mark'
					}
				}
			})
		}
		if(config.madai=='老马岱'){
			lib.arenaReady.push(function(){				
				lib.skill.qianxi={
					trigger:{player:'shaHit'},
					filter:function(event,player){
						return get.distance(player,event.player)<=1&&event.notLink();
					},
					content:function(){
						"step 0"
						player.line(trigger.target);
						player.judge(function(card){
							if(get.suit(card)=='heart') return -1;
							return 1;
						})
						"step 1"
						if(result.bool){
							trigger.untrigger();
							trigger.finish();
							trigger.target.loseMaxHp(true);
						}
					}
				}
				lib.translate.qianxi_info='当你使用【杀】对目标角色造成伤害时,你可以防止此伤害,若如此做,目标角色减一点体力上限'
			})
		}
		if(config.old_guanzhang){
			lib.arenaReady.push(function(){				
				lib.skill.fuhun={
					audio:2,
					trigger:{player:'phaseDrawBegin'},
					content:function(){
						event.cards=get.cards(2);
						if(get.color(event.cards[0])!=get.color(event.cards[1])){
							player.addTempSkill('wusheng','phaseEnd');
							player.addTempSkill('paoxiao','phaseEnd');
						}
						player.gain(event.cards,'gain2');
						trigger.finish();
						trigger.untrigger();
					}
				}
				lib.translate.fuhun_info='摸牌阶段开始时,你可以放弃摸牌,亮出牌顶的两张牌并获得之,若其颜色不同,你视为拥有"武圣"和"咆哮"直到回合结束'
			})
		}
		//------------------------------国战修改----------------------------------//
		if(lib.config.mode=='guozhan'){
			if(config.feilong){
				lib.arenaReady.push(function(){
					lib.card.cixiong={
						fullskin:true,
						type:'equip',
						subtype:'equip1',
						distance:{attackFrom:-1},
						ai:{
							basic:{
								equipValue:2
							}
						},
						skills:['feilong_skill']
					}
					lib.skill.feilong_skill={
						trigger:{player:'shaBegin'},
						priority:5,
						audio:'cixiong_skill',
						filter:function(event,player){
							return event.target.num('he');
						},
						check:function(event,player){
							if(event.target.hasSkillTag('noh')) return false;
							return ai.get.attitude(player,event.target)<0;
						},
						content:function(){
							trigger.target.chooseToDiscard(true)
						},
						group:['feilong_skill2']
					}
					lib.skill.feilong_skill2={
						trigger:{source:'damageAfter'},
						priority:-1,
						audio:'cixiong_skill',
						filter:function(event,player){
							if(!event.player.isDead()) return false;
							if(!event.card||event.card.name!='sha') return false;
							if(player.identity=='ye') return false;
							if(player.identity=='unknown') return false;
							if(!player.isMinPop())return false;
							return event.player.identity!=player.identity;
						},
						content:function(){
							'step 0'
							trigger.player.revive();
							var list=[];
							for(var i in lib.character){
								if(lib.character[i].mode&&lib.character[i].mode.contains(lib.config.mode)==false) continue;
								if(lib.character[i][1]!=player.group) continue;
								if(i!='list') list.push(i);
							}
							for(var j=0;j<game.players.length;j++){
								list.remove([game.players[j].name]);
								list.remove([game.players[j].name2]);
							}
							trigger.player.chooseButton(ui.create.dialog([list,'character']),true,function(button){
								var i=Math.floor(Math.random()*list.length);	
								return list[i];
							})
							'step 1'
							trigger.player.uninit();
							trigger.player.init(result.buttons[0].link,'shibing');
							trigger.player.identity=player.identity;
							trigger.player._group=player.identity;
							trigger.player.setIdentity(player.identity);						
						}
					}					
					lib.translate.cixiong='飞龙夺凤';
					lib.translate.feilong_skill='飞龙夺凤';
					lib.translate.feilong_skill2='飞龙夺凤';
					lib.translate.cixiong_info='当你使用【杀】指定一名角色为目标后,你可令该角色弃置一张牌.你使用【杀】杀死一名角色后,若你所属的势力是全场最少的（或之一）,你可令该角色的使用者选择是否从未使用的武将牌中选择一张与你势力相同的武将牌重新加入游戏';
				})
			}
			lib.arenaReady.push(function(){
				if(lib.character.caohong) lib.character.caohong[3]=['yuanhu','heyi'];
				lib.translate.yuanhu_info='结束阶段开始时，你可以将一张装备牌置于一名角色装备区内，然后你弃置该角色距离1的一名角色区域内的一张牌。'
				lib.translate.heyi='鹤翼';
				lib.translate.heyi_info='锁定技，与你处于同一队列的其它角色视为拥有技能“飞影”。';
				lib.skill.yuanhu={
					audio:3,
					trigger:{player:'phaseEnd'},
					direct:true,
					filter:function(event,player){
						return player.num('he',{type:'equip'})>0;
					},
					content:function(){
						"step 0"
						player.chooseCardTarget({
							filterCard:function(card){
								return get.type(card)=='equip';
							},
							position:'he',
							filterTarget:function(card,player,target){
								return !target.get('e',get.subtype(card)[5]);
							},
							ai1:function(card){
								return 6-ai.get.value(card);
							},
							ai2:function(target){
								return ai.get.attitude(_status.event.player,target)-3;
							},
							prompt:'是否发动援护？'
						});
						"step 1"
						if(result.bool){
							player.logSkill('yuanhu',result.targets);
							var thisTarget=result.targets[0];
							var thisCard=result.cards[0];
							thisTarget.equip(thisCard);
							event.target=thisTarget;
							if(thisTarget!=player){
								player.$give(thisCard,thisTarget);
							}
							for(var i=0;i<game.players.length;i++){
								if(get.distance(thisTarget,game.players[i])<=1) break;
							}
							if(i==game.players.length) return;
							game.delay();
							player.chooseTarget(true,function(card,player,target){
								return get.distance(_status.event.thisTarget,target)<=1&&target.num('hej');
							}).set('ai',function(target){
								var attitude=ai.get.attitude(_status.event.player,target);
								if(attitude>0&&target.num('j')){
									return attitude*1.5;
								}
								return -attitude;
							}).set('thisTarget',thisTarget);
						}
						else{
							event.finish();
						}
						"step 2"
						if(result.targets.length){
							player.discardPlayerCard(true,result.targets[0],'hej');
						}
					},
					ai:{
						threaten:0.8
					}
				}
				lib.skill.heyi={
					global:'heyi2',
					unique:true,
					forceunique:true
				}
				lib.skill.heyi2={
					mod:{
						globalFrom:function(from,to,distance){
							if(!get.skillOwner('yuanhu')) return ;
							if(to.inline(get.skillOwner('yuanhu'))) return distance+1;
						}
					}
				}
				lib.translate.xuanfeng='烈风';
				lib.translate.xuanfeng_info='你失去一次装备区的牌后，你可以弃置一名其它角色的一张牌。'
				lib.translate.xuanlue='旋略';
				lib.translate.xuanlue_info='限定技，出牌阶段，你可以从场上获得至多三张装备牌，然后将这些牌置入至多三名角色的装备区内。'
				if(lib.character.lingtong) lib.character.lingtong[3]=['xuanfeng','xuanlue'];
				lib.skill.xuanfeng={
					audio:2,
					trigger:{player:'loseEnd'},
					direct:true,
					filter:function(event,player){
						for(var i=0;i<event.cards.length;i++){
							if(event.cards[i].original=='e') return true;
						}
						return false;
					},
					content:function(){
						"step 0"
						player.chooseTarget('请选择烈风的目标',function(card,player,target){
							if(player==target) return false;
							return target.num('he');
						}).set('ai',function(target){
							return ai.get.disEffect(player,target);
						});
						"step 1"
						if(result.bool){
							player.logSkill('xuanfeng',result.targets);
							player.discardPlayerCard(result.targets[0],'he',true);
						}
					},
					ai:{
						effect:{
							target:function(card,player,target,current){
								if(get.type(card)=='equip') return [1,2];
							}
						},
					}
				}
				
				lib.skill.xuanlue={
					audio:2,
					unique:true,
					enable:'phaseUse',
					filter:function(event,player){
						return !player.storage.xuanlue;
						return true;
					},
					content:function(){
						'step 0'
						player.storage.xuanlue=true;
						var dialog=ui.create.dialog('请选择至多三张装备牌');
						for(var i=0;i<game.players.length;i++){
							if(i==0) continue;
							if(game.players[i].num('e')){
								dialog.add(get.translation(game.players[i].name)+'的装备牌');
								dialog.add(game.players[i].get('e'));
							}
						}
						var next=player.chooseButton(dialog,[1,3]);
						next.set('ai',function(button){
							for(var i=0;i<game.players.length;i++){
								var target=game.players[i];
								if(target.get('e').contains(button.link)){
									if(!target.isE(player)) return -1;
									break;
								}
							}
							return ai.get.buttonValue;
						})
						'step 1'
						if(result.bool){
							player.$skill(lib.translate.xuanlue,'epic')
							for(var i=0;i<result.links.length;i++){
								for(var j=0;j<game.players.length;j++){
									var name=game.players[j];
									if(game.players[j].get('e').contains(result.links[i])){
										player.line(game.players[j],'green');
										game.players[j].$give(result.links[i],player);
										break;
									}
								}
							}
							event.cards=result.links;
							player.gain(result.links);
						}
						else{
							event.finish();
						}
						'step 2'
						player.chooseCardTarget({
							filterCard:function(card){
								if(!event.cards.length){
									return event.cards=card;
								}
								return event.cards.contains(card);
							},
							ai1:function(card){
								return 6-ai.get.value(card);
							},
							ai2:function(target){
								if(!target.isBF(player)) return 0;
								if(player.hasSkill('xiaoji')) return 0;
								if(!target.num('e',ui.selected.cards[0].name)&&Math.random()<0.5) return 1;
								return 0;
							},
							prompt:'请将获得的装备牌任意分配'
						},true);
						'step 3'
						if(result.targets[0]!=player){
							player.$give(result.cards[0],result.targets[0]);
						}
						result.targets[0].equip(result.cards[0]);
						event.cards.remove(result.cards[0]);
						if(event.cards.length) event.goto(2);
					},
					ai:{
						order:10,
						result:{
							player:function(player){
								if(game.phaseNumber<6) return -1;
								var num=0;
								for(var i=0;i<game.players.length;i++){
									var target=game.players[i];
									if(target.num('e')&&!target.isF(player)){
										num+=target.num('e');
									}
								}
								if(player.isSafe()) return num-2;
								else return num-1;
							}
						}
					}
				}
				lib.skill.xiaoji.content=function(){
					player.draw(2);
				}
				/*lib.skill.wanwei={
					trigger:{player:'loseBefore'},
					filter:function(event,player){
						if(event.getParent().name=='gain') return true;
						return false;
					},
					group:'wanwei2',
					direct:true,
					content:function(){
						'step 0'
						player.chooseCard('失去的牌为'+get.translation(trigger.cards)+'是否发动【挽危】？','hej',trigger.cards.length).ai=function(card){
							return 10-ai.get.value(card);
						}
						'step 1'
						if(result.bool){
							game.log(player,'选择了',result.cards);
							trigger.cards=result.cards;
							if(trigger.getParent().name=='discard'){
								player.$throw(result.cards);
							}
						}
					}
				}
				lib.skill.wanwei2={
					trigger:{player:'discardBefore'},
					direct:true,
					filter:function(event,player){
						if(event.getParent(2).name=='phaseDiscard') return false;
						return true;
					},
					content:lib.skill.zhiheng.content,
				}
				game.zhu.init('sunquan');
				game.me.next.init('zhangliao');
				game.me.next.identity='fan'*/
				lib.translate.xiaoji_info='当你失去一次装备区里的牌时,你可以摸两张牌'
				lib.skill.shushen.content=function(){
					"step 0"
					player.chooseTarget('是否发动【淑慎】？',function(card,player,target){
						if(target.identity!='shu') return false;
						return target!=player;
					}).ai=function(target){
						return ai.get.gainEffect(player,target);
					}
					"step 1"
					if(result.bool){
						player.logSkill('shushen');
						event.target=result.targets[0];
						if(event.target.hp==event.target.maxHp){
							event.target.draw(2);
							event.finish();
						}
						else{
							event.target.chooseControl('draw_card','recover_hp',function(event,target){
								if(target.hp>=2||target.hp>=target.maxHp-1) return 'draw_card';
								if(target.hp==2&&target.num('h')==0) return 'draw_card';
								return 'recover_hp';
							});
						}
					}
					else{
						event.finish();
					}
					"step 2"
					if(result.control=='draw_card'){
						target.draw(2);
					}
					else{
						target.recover();
					}
				}
				if(lib.character.guanyu) lib.character.guanyu[2]=5
				if(lib.character.lvbu) lib.character.lvbu[2]=5
				if(lib.character.sp_dongzhuo) lib.character.sp_dongzhuo[2]=4
				lib.translate.qiluan_info='一名角色的回合结束后,若你于此回合杀死过一名角色,你可以摸三张牌'
				lib.skill.qiluan={
					audio:2,
					trigger:{global:'phaseEnd'},
					frequent:true,
					filter:function(event,player){
						return player.storage.ql?true:false;
					},
					content:function(){
						player.draw(3);
						player.storage.ql=0;
					},
					init:function(player){
						player.storage.ql=0;
					},
					group:['qiluan2']
				}
				lib.skill.qiluan2={
					trigger:{source:'dieAfter'},
					forced:true,
					silent:true,
					popup:false,
					content:function(){
						player.storage.ql++;
					}
				}
				if(lib.character.luxun) lib.character.luxun[3]=['qianxun','dushi']
				lib.skill.qianxun={
					audio:['qianxun',2],
					trigger:{target:['shunshouBefore','lebuBefore']},
					forced:true,
					content:function(){
						trigger.untrigger();
						trigger.finish();
					},
					ai:{
						order:2,
						effect:{
							target:function(card,player,target,current){
								if(card.name=='shunshou'||card.name=='lebu') return 'zeroplayertarget';
							}
						}
					}			
				}
				lib.translate.dushi='度势'
				lib.translate.dushi_info='你可以将一张红色手牌当【以逸待劳】使用,每阶段限4次'
				lib.skill.dushi={
					audio:['dushi',2],
					enable:['chooseToUse'],
					usable:4,
					filterCard:function(card){
						return get.color(card)=='red';
					},
					viewAs:{name:'yiyi'},
					viewAsFilter:function(player){
						if(!player.num('h',{color:'red'})) return false;
					},
					check:function(card){
						var player=_status.currentPhase;
						if(player.num('h')<=player.hp) return 0;
						return 5-ai.get.value(card)
					},
					prompt:'将一张红色手牌当以逸待劳使用'
				}
				if(lib.character.zhonghui) lib.character.zhonghui[3]=['quanji','zili','bingjie']
				lib.translate.zili_info='【主将技】你计算体力上限时减少一个单独的阴阳鱼.限定技,出牌阶段,你可以明置此武将牌,然后选择一项:回复一点体力,或摸2张牌.然后若你所属的势力为大势力,你须将自己身份变为"野心家",最后移除你的副将并获得"排异".'
				lib.translate.paiyi_info=
				'出牌阶段,你可以将一张"权"当做【远交近攻】使用'				
				lib.skill.zili={
					skillAnimation:'epic',
					animationColor:'thunder',
					audio:2,
					enable:'phaseUse',
					filter:function(event,player){
						return !player.storage.zl&&player.name1=="zhonghui";
					},
					content:function(){
						"step 0"
						player.storage.zl=true;
						if(player.isBigPop()){
							 player.identity="ye";
							 player.setIdentity();
						}		
						"step 1"
						player.chooseControl('回血','摸牌',function(event,player){
							if(player.hp>=2) return '摸牌';
							return '回血';
						});
						"step 2"
						if(result.control=='摸牌') player.draw(2);
						else player.recover();
						"step 4"
						if(player.identity=="ye"){			
							player.removeFujiang();
							player.showCharacter(1);
							player.addSkill('paiyi');
							player.updateMarks();
						}
					},
					init:function(player){
						if(player.name1=='zhonghui'){
							if(!event.forced&&typeof player.singleHp==='boolean'){
								if(player.singleHp){
									player.singleHp=false;
								}
								else{
									player.singleHp=true;
									player.maxHp-=1;
								}
							}
							else{
								player.maxHp-=1;
							}
							player.update();
						}
					},
					ai:{
						order:4,
						result:{
							player:function(player){
								if(player.name2=='zhenji'||player.name2=='guojia')return 0;
								if(player.num('h',{name:'tao'})&&player.num('h')>2) return 0;
								if(get.population('wei')>=2&&player.identity!="ye"&& player.hp>1) return 0;
								if(get.population('wei')/game.players.length>(2/5)) return 0;
								if(player.identity=="ye"||game.players.length<6) return 1;						
								return player.hp<2&&player.num('h')<3?1:0;
							}
						},
						threaten:0.9
					}
				}
				lib.translate.bingjie='兵解'
				lib.translate.bingjie_info='【副将技】限定技,出牌阶段你可以弃置所有的"权"对等量的角色各造成一点伤害'
				lib.skill.bingjie={
					audio:['bingjie',2],
					skillAnimation:'epic',
					animationColor:'thunder',
					enable:'phaseUse',
					filter:function(event,player){
						return player.name2=='zhonghui'&&player.storage.quanji.length>0&&!player.storage.bingjie;
					},
					mark:true,
					filterTarget:function(card,player,target){
						return player!=target;
					},
					selectTarget:function(){
						return [1,_status.event.player.storage.quanji.length];
					},
					content:function(){
						"step 0"
						player.unmarkSkill('bingjie');
						player.storage.bingjie=true;
						'step 1'
						var list=[];
						for(var i=0;i<player.storage.quanji.length;i++){
							list.push(player.storage.quanji[i]);
						}
						player.discard(list);
						player.storage.quanji.remove(list);
						player.unmarkSkill('quanji');
						"step 2"
						target.damage();
					},
					intro:{
						content:'limited'
					},
					ai:{
						order:2,
						result:{
							player:function(player){
								if(player.storage.quanji.length>=4) return 0;
								if(player.hp<=1) return player.num('h')>3?0:1;
								return 0;
							},
							target:function(player,target){
								return ai.get.damageEffect(target,player)<-1;
							}					
						}
					}
				}
				lib.skill.paiyi={
					audio:2,
					enable:'phaseUse',
					filter:function(event,player){
						return player.storage.quanji.length>0;
					},
					usable:1,
					filterTarget:function(card,player,target){
						return player!=target;
					},
					content:function(){
						"step 0"
						player.chooseCardButton('排异',player.storage.quanji,true);
						"step 1"
						player.storage.quanji.remove(result.buttons[0].link);
						if(!player.storage.quanji.length){
							player.unmarkSkill('quanji');
						}
						player.useCard({name:'yuanjiao'},[result.buttons[0].link],target).audio=false;
					},
					ai:{
						order:10,
						result:{
							target:function(player,target){
								if(player.num('h')+2<=player.hp+player.storage.quanji.length){
									return -10+target.num('h')
								}
								return 0;
							}
						}
					}
				}
				if(lib.character.zhoutai) lib.character.zhoutai[3]=['buqu']
				lib.skill.buqu={
					audio:2,
					trigger:{player:'dying'},
					priority:15,
					filter:function(event,player){
						return player.maxHp>0;
					},
					content:function(){
						"step 0"
						if(player.storage.buqu==undefined) player.storage.buqu=[];
						for(var i=0;i<player.storage.num;i++){
							event.card=get.cards()[0];
							player.storage.buqu.push(event.card);
						}
						player.showCards(player.storage.buqu,'不屈');
						game.log(player,'的不屈牌为',player.storage.buqu);
						player.markSkill('buqu');
						player.syncStorage('buqu');
						"step 1"
						for(var i=0;i<player.storage.buqu.length;i++){
							for(var j=0;j<player.storage.buqu.length;j++){
								if(i==j) continue;						
								if(get.number(player.storage.buqu[j])==get.number(player.storage.buqu[i])) return;
							}
						}
						trigger.untrigger();
						trigger.finish();
						player.hp=0;
					},
					group:['buqu2','buqu3'],
					intro:{
					   content:'cards'
					}
				}
				lib.skill.buqu2={
					audio:'buqu',
					direct:true,
					trigger:{player:'recoverBegin'},
					filter:function(event,player){
						if(!player.storage.buqu) return false;
						return player.maxHp>0;
					},
					content:function(){	
						'step 0'
						trigger.untrigger();
						trigger.finish();
						'step 1'
						player.chooseCardButton('不屈',player.storage.buqu);
						"step 2"
						if(result.bool){
							var card=result.buttons[0].link;
							player.logSkill('buqu');
							player.storage.buqu.remove(card);
							player.discard(card);
							if(player.storage.buqu.length==0){
								player.unmarkSkill('buqu');
								player.hp=1;
								delete player.storage.buqu;
							}
						}
					}
				}
				lib.skill.buqu3={
					trigger:{player:'damageBegin'},
					priority:-1,
					forced:true,
					popup:false,
					silent:true,
					filter:function(event,player){
						return event.num>=player.hp;
					},
					content:function(){						
						player.storage.num=0;
						if(trigger.num>=player.hp){
							if(player.hp>0) player.storage.num=trigger.num-player.hp+1; 
							else player.storage.num=trigger.num-player.hp;
						}
					}
				}
				lib.translate.buqu_info='每当你扣减1点体力后,若你的体力值为0或更低,你可以将牌堆顶的一张牌置于你的武将牌上,然后若无同点数的"不屈牌",你不进入濒死状态.每当你回复1点体力后,你将一张"不屈牌"置入弃牌堆'
				if(lib.character.sunce) lib.character.sunce[3]=['jiang','hunshang']
				lib.translate.hunshang='魂殇'
				lib.translate.hunshang_info='【副将技】你计算体力上限时减少一个单独的阴阳鱼.回合开始时,你可以明置此武将牌.锁定技,若此武将牌已明置,你视为拥有技能"英姿"和"英魂"'
				lib.skill.hunshang={
					trigger:{player:'phaseBegin'},
					forced:true,
					filter:function(event,player){
						return player.name2=="sunce"&&!player.storage.hs;
					},
					content:function(){
						player.storage.hs=true;	
						player.addSkill('reyingzi');
						player.addSkill('yinghun');
					},
					init:function(player){
						if(player.name2=='sunce'){
							if(!event.forced&&typeof player.singleHp==='boolean'){
								if(player.singleHp){
									player.singleHp=false;
								}
								else{
									player.singleHp=true;
									player.maxHp-=1;
								}
							}
							else{
								player.maxHp-=1;
							}
							player.update();
						}
					}
				}
				lib.skill.xiaoguo.content=function(){
					"step 0"
					var nono=(Math.abs(ai.get.attitude(player,trigger.player))<3);
					var next=player.chooseToDiscard('是否发动【骁果】？',{type:'basic'});
					next.ai=function(card){
						if(nono) return 0;
						if(ai.get.damageEffect(trigger.player,player,player)>0){
							return 8-ai.get.useful(card);
						}
						return 0;
					}
					next.logSkill=['xiaoguo',trigger.player];
					"step 1"
					if(result.bool){
						var nono=(ai.get.damageEffect(trigger.player,player,trigger.player)>=0);
						trigger.player.chooseToDiscard('he',{type:'equip'}).ai=function(card){
							if(nono){
								return 0;
							}
							if(trigger.player.hp==1) return 10-ai.get.value(card);
							return 9-ai.get.value(card);
						}
					}
					else{
						event.finish();
					}
					"step 2"
					if(!result.bool){
						trigger.player.damage();
					}
				}
				lib.translate.xiaoguo_info='其他角色的结束阶段开始时,你可以弃置一张基本牌,令该角色选择一项：1.弃置一张装备牌;2.受到你对其造成的1点伤害'
				if(lib.character.jiangwei) lib.character.jiangwei[3]=['tiaoxin','yizhi','tianfu']
				lib.translate.yizhi='遗志'
				lib.translate.yizhi_info='【副将技】你计算体力上限时减少一个单独的阴阳鱼.若你的主将 拥有技能"观星"把描述中的"X"改为5.否则视为你拥有技能"观星"'
				lib.translate.tianfu='天覆'
				lib.translate.tianfu_info='【主将技】与你势力相同的角色回合内,你视为拥有技能"看破".'
				lib.skill.tianfu={
					trigger:{global:'phaseBegin'},
					forced:true,
					popup:false,
					filter:function(event,player){
						if(!event.player.isSameGroup(player)) return false;
						return player.name1=='jiangwei';
					},
					content:function(){
						player.addTempSkill('kanpo','phaseEnd');
					}
				}
				lib.skill.yizhi={
					trigger:{player:'phaseBegin'},
					forced:true,
					silent:true,
					popup:false,
					filter:function(event,player){
						if(player.classList.contains('unseen')||player.classList.contains('unseen2')) return false;
						if(!lib.character[player.name1][3].contains('guanxing')) return false;
						if(player.storage.yz) return false;
						return player.name2=='jiangwei';
					},
					content:function(){
						player.addSkill('yizhi_guanxing');
						game.createTrigger('phaseBegin','yizhi_guanxing',player,trigger);
						player.storage.yz=true;
					},
					init:function(player){
						if(player.name2=='jiangwei'){
							if(!event.forced&&typeof player.singleHp==='boolean'){
								if(player.singleHp){
									player.singleHp=false;
								}
								else{
									player.singleHp=true;
									player.maxHp-=1;
								}
							}
							else{
								player.maxHp-=1;
							}
							player.update();
						}
					},
					group:['yizhi2','yizhi3','yizhi4']
				}
				lib.skill.yizhi2={
					trigger:{player:'triggerBefore'},
					filter:function(event,player){
						if(player.hasSkill('shibei2')) return false;
						if(!lib.character[player.name1][3].contains('guanxing')) return false;
						return event.skill=='guanxing'&&player.name2=='jiangwei';
					},
					forced:true,
					popup:false,
					silent:true,
					content:function(){
						'step 0'
						trigger.untrigger();
						trigger.cancelled=true;
						player.addTempSkill('shibei2','phaseEnd');
						if(player.classList.contains('unseen2')){
							player.chooseControl('不明置','明置姜维').ai=function(){
								return '明置姜维';
							}
						}
						else event.finish();
						'step 1'
						if(result.control=='明置姜维'){
							player.showCharacter(1);
						}
						if(result.control=='不明置'){
							event.finish();
						}							
					}
				}
				lib.skill.yizhi3={
					trigger:{player:'phaseBegin'},
					forced:true,
					silent:true,
					popup:false,
					priority:-10,
					filter:function(event,player){
						if(player.classList.contains('unseen')) return false;
						if(!lib.character[player.name1][3].contains('guanxing')) return false;
						return player.name2=='jiangwei'&&player.classList.contains('unseen2');
					},
					content:function(){
						game.createTrigger('phaseBegin','guanxing',player,trigger);
					}
				}
				lib.translate.yizhi4='遗志•观星'
				lib.skill.yizhi4={
					audio:['guanxing_jiangwei',2],
					trigger:{player:'phaseBegin'},
					frequent:true,
					filter:function(event,player){
						return !lib.character[player.name1][3].contains('guanxing')&&player.name2=='jiangwei'
					},
					content:function(){
						"step 0"
						if(player.isUnderControl()){
							game.modeSwapPlayer(player);
						}
						var cards=get.cards(Math.min(5,game.players.length));
						event.cards=cards;
						var switchToAuto=function(){
							_status.imchoosing=false;
							if(event.dialog) event.dialog.close();
							if(event.control) event.control.close();
							var top=[];
							var judges=player.node.judges.childNodes;
							var stopped=false;
							if(!player.num('h','wuxie')){
								for(var i=0;i<judges.length;i++){
									var judge=get.judge(judges[i]);
									cards.sort(function(a,b){
										return judge(b)-judge(a);
									});
									if(judge(cards[0])<0){
										stopped=true;break;
									}
									else{
										top.unshift(cards.shift());
									}
								}
							}
							var bottom;
							if(!stopped){
								cards.sort(function(a,b){
									return ai.get.value(b,player)-ai.get.value(a,player);
								});
								while(cards.length){
									if(ai.get.value(cards[0],player)<=5) break;
									top.unshift(cards.shift());
								}
							}
							bottom=cards;
							for(var i=0;i<top.length;i++){
								ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
							}
							for(i=0;i<bottom.length;i++){
								ui.cardPile.appendChild(bottom[i]);
							}
							player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
							game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
							game.delay(2);
						};
						var chooseButton=function(online,player,cards){
							var event=_status.event;
							player=player||event.player;
							cards=cards||event.cards;
							event.top=[];
							event.bottom=[];
							event.status=true;
							event.dialog=ui.create.dialog('按顺序选择置于牌堆顶的牌（先选择的在上）',cards);
							event.switchToAuto=function(){
								event._result='ai';
								event.dialog.close();
								event.control.close();
								_status.imchoosing=false;
							},
							event.control=ui.create.control('ok','pileTop','pileBottom',function(link){
								var event=_status.event;
								if(link=='ok'){
									if(online){
										event._result={
											top:[],
											bottom:[]
										}
										for(var i=0;i<event.top.length;i++){
											event._result.top.push(event.top[i].link);
										}
										for(var i=0;i<event.bottom.length;i++){
											event._result.bottom.push(event.bottom[i].link);
										}
									}
									else{
										var i;
										for(i=0;i<event.top.length;i++){
											ui.cardPile.insertBefore(event.top[i].link,ui.cardPile.firstChild);
										}
										for(i=0;i<event.bottom.length;i++){
											ui.cardPile.appendChild(event.bottom[i].link);
										}
										for(i=0;i<event.dialog.buttons.length;i++){
											if(event.dialog.buttons[i].classList.contains('glow')==false&&
												event.dialog.buttons[i].classList.contains('target')==false)
											ui.cardPile.appendChild(event.dialog.buttons[i].link);
										}
										player.popup(get.cnNumber(event.top.length)+'上'+get.cnNumber(event.cards.length-event.top.length)+'下');
										game.log(player,'将'+get.cnNumber(event.top.length)+'张牌置于牌堆顶');
									}
									event.dialog.close();
									event.control.close();
									game.resume();
									_status.imchoosing=false;
								}
								else if(link=='pileTop'){
									event.status=true;
									event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆顶的牌';
								}
								else{
									event.status=false;
									event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆底的牌';
								}
							})
							for(var i=0;i<event.dialog.buttons.length;i++){
								event.dialog.buttons[i].classList.add('selectable');
							}
							event.custom.replace.button=function(link){
								var event=_status.event;
								if(link.classList.contains('target')){
									link.classList.remove('target');
									event.top.remove(link);
								}
								else if(link.classList.contains('glow')){
									link.classList.remove('glow');
									event.bottom.remove(link);
								}
								else if(event.status){
									link.classList.add('target');
									event.top.unshift(link);
								}
								else{
									link.classList.add('glow');
									event.bottom.push(link);
								}
							}
							event.custom.replace.window=function(){
								for(var i=0;i<_status.event.dialog.buttons.length;i++){
									_status.event.dialog.buttons[i].classList.remove('target');
									_status.event.dialog.buttons[i].classList.remove('glow');
									_status.event.top.length=0;
									_status.event.bottom.length=0;
								}
							}
							game.pause();
							game.countChoose();
						};
						event.switchToAuto=switchToAuto;

						if(event.isMine()){
							chooseButton();
							event.finish();
						}
						else if(event.isOnline()){
							event.player.send(chooseButton,true,event.player,event.cards);
							event.player.wait();
							game.pause();
						}
						else{
							event.switchToAuto();
							event.finish();
						}
						"step 1"
						if(event.result=='ai'||!event.result){
							event.switchToAuto();
						}
						else{
							var top=event.result.top||[];
							var bottom=event.result.bottom||[];
							for(var i=0;i<top.length;i++){
								ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
							}
							for(i=0;i<bottom.length;i++){
								ui.cardPile.appendChild(bottom[i]);
							}
							for(i=0;i<event.cards.length;i++){
								if(!top.contains(event.cards[i])&&!bottom.contains(event.cards[i])){
									ui.cardPile.appendChild(event.cards[i]);
								}
							}
							player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(event.cards.length-top.length)+'下');
							game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
							game.delay(2);
						}
					},
					ai:{
						threaten:1.2
					}
				}
				lib.translate.yizhi_guanxing='观星'
				lib.translate.yizhi_guanxing_info='回合开始阶段,你可以观看牌堆顶的5张牌,并将其以任意顺序置于牌堆项或牌堆底'
				lib.skill.yizhi_guanxing={
					audio:'guanxing',
					trigger:{player:'phaseBegin'},
					frequent:true,
					content:function(){
						"step 0"
						if(player.isUnderControl()){
							game.modeSwapPlayer(player);
						}
						var cards=get.cards(5);
						event.cards=cards;
						var switchToAuto=function(){
							_status.imchoosing=false;
							if(event.dialog) event.dialog.close();
							if(event.control) event.control.close();
							var top=[];
							var judges=player.node.judges.childNodes;
							var stopped=false;
							if(!player.num('h','wuxie')){
								for(var i=0;i<judges.length;i++){
									var judge=get.judge(judges[i]);
									cards.sort(function(a,b){
										return judge(b)-judge(a);
									});
									if(judge(cards[0])<0){
										stopped=true;break;
									}
									else{
										top.unshift(cards.shift());
									}
								}
							}
							var bottom;
							if(!stopped){
								cards.sort(function(a,b){
									return ai.get.value(b,player)-ai.get.value(a,player);
								});
								while(cards.length){
									if(ai.get.value(cards[0],player)<=5) break;
									top.unshift(cards.shift());
								}
							}
							bottom=cards;
							for(var i=0;i<top.length;i++){
								ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
							}
							for(i=0;i<bottom.length;i++){
								ui.cardPile.appendChild(bottom[i]);
							}
							player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(bottom.length)+'下');
							game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
							game.delay(2);
						};
						var chooseButton=function(online,player,cards){
							var event=_status.event;
							player=player||event.player;
							cards=cards||event.cards;
							event.top=[];
							event.bottom=[];
							event.status=true;
							event.dialog=ui.create.dialog('按顺序选择置于牌堆顶的牌（先选择的在上）',cards);
							event.switchToAuto=function(){
								event._result='ai';
								event.dialog.close();
								event.control.close();
								_status.imchoosing=false;
							},
							event.control=ui.create.control('ok','pileTop','pileBottom',function(link){
								var event=_status.event;
								if(link=='ok'){
									if(online){
										event._result={
											top:[],
											bottom:[]
										}
										for(var i=0;i<event.top.length;i++){
											event._result.top.push(event.top[i].link);
										}
										for(var i=0;i<event.bottom.length;i++){
											event._result.bottom.push(event.bottom[i].link);
										}
									}
									else{
										var i;
										for(i=0;i<event.top.length;i++){
											ui.cardPile.insertBefore(event.top[i].link,ui.cardPile.firstChild);
										}
										for(i=0;i<event.bottom.length;i++){
											ui.cardPile.appendChild(event.bottom[i].link);
										}
										for(i=0;i<event.dialog.buttons.length;i++){
											if(event.dialog.buttons[i].classList.contains('glow')==false&&
												event.dialog.buttons[i].classList.contains('target')==false)
											ui.cardPile.appendChild(event.dialog.buttons[i].link);
										}
										player.popup(get.cnNumber(event.top.length)+'上'+get.cnNumber(event.cards.length-event.top.length)+'下');
										game.log(player,'将'+get.cnNumber(event.top.length)+'张牌置于牌堆顶');
									}
									event.dialog.close();
									event.control.close();
									game.resume();
									_status.imchoosing=false;
								}
								else if(link=='pileTop'){
									event.status=true;
									event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆顶的牌';
								}
								else{
									event.status=false;
									event.dialog.content.childNodes[0].innerHTML='按顺序选择置于牌堆底的牌';
								}
							})
							for(var i=0;i<event.dialog.buttons.length;i++){
								event.dialog.buttons[i].classList.add('selectable');
							}
							event.custom.replace.button=function(link){
								var event=_status.event;
								if(link.classList.contains('target')){
									link.classList.remove('target');
									event.top.remove(link);
								}
								else if(link.classList.contains('glow')){
									link.classList.remove('glow');
									event.bottom.remove(link);
								}
								else if(event.status){
									link.classList.add('target');
									event.top.unshift(link);
								}
								else{
									link.classList.add('glow');
									event.bottom.push(link);
								}
							}
							event.custom.replace.window=function(){
								for(var i=0;i<_status.event.dialog.buttons.length;i++){
									_status.event.dialog.buttons[i].classList.remove('target');
									_status.event.dialog.buttons[i].classList.remove('glow');
									_status.event.top.length=0;
									_status.event.bottom.length=0;
								}
							}
							game.pause();
							game.countChoose();
						};
						event.switchToAuto=switchToAuto;

						if(event.isMine()){
							chooseButton();
							event.finish();
						}
						else if(event.isOnline()){
							event.player.send(chooseButton,true,event.player,event.cards);
							event.player.wait();
							game.pause();
						}
						else{
							event.switchToAuto();
							event.finish();
						}
						"step 1"
						if(event.result=='ai'||!event.result){
							event.switchToAuto();
						}
						else{
							var top=event.result.top||[];
							var bottom=event.result.bottom||[];
							for(var i=0;i<top.length;i++){
								ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
							}
							for(i=0;i<bottom.length;i++){
								ui.cardPile.appendChild(bottom[i]);
							}
							for(i=0;i<event.cards.length;i++){
								if(!top.contains(event.cards[i])&&!bottom.contains(event.cards[i])){
									ui.cardPile.appendChild(event.cards[i]);
								}
							}
							player.popup(get.cnNumber(top.length)+'上'+get.cnNumber(event.cards.length-top.length)+'下');
							game.log(player,'将'+get.cnNumber(top.length)+'张牌置于牌堆顶');
							game.delay(2);
						}
					},
					ai:{
						threaten:1.2
					}
				}
				if(lib.character.xusheng) lib.character.xusheng[3]=['yicheng']
				lib.skill.yicheng={
					audio:['yicheng',2],
					trigger:{global:'shaBegin'},
					priority:6,
					filter:function(event,player){
						return event.target.isSameGroup(player);
					},
					check:function(event,player){
						return ai.get.attitude(player,event.player)>0;
					},
					content:function(){
						player.logSkill('疑城',trigger.target);
						trigger.target.draw();
						trigger.target.chooseToDiscard('he',true);
					}
				}
				lib.translate.yicheng='疑城'
				lib.translate.yicheng_info='每当与你势力相同的一名角色成为【杀】的目标后,你可以令其摸一张牌,然后其弃置一张牌'
				lib.skill.mingshi={
					audio:2,
					trigger:{player:'damageBegin'},
					filter:function(event,player){
						return event.source;
					},
					forced:true,
					filter:function(event,player){
						return event.source.classList.contains('unseen')||event.source.classList.contains('unseen2')
					},
					content:function(){
						trigger.num--;
					},
					ai:{
						effect:{
							target:function(card,player,target,current){
								if(player.classList.contains('unseen')||player.classList.contains('unseen2')){
									if(get.tag(card,'damage')){
										return [0,0];
								}}
							}
						}
					}				
				}
				lib.skill.lirang.ai.noh=true
				lib.translate.mingshi_info='当你受到一次伤害后,若伤害来源有暗置的武将牌,此伤害减一'
			
				lib.skill.shangyi={
					audio:2,
					enable:'phaseUse',
					usable:1,
					filterTarget:function(card,player,target){
						return player!=target&&target.num('h');
					},
					content:function(){
						"step 0"
						var controls=[];
						if(target.get('h').length) controls.push('手牌');
						if(target.classList.contains('unseen')||target.classList.contains('unseen2')) controls.push('观看其暗置的武将牌');
						if(controls.length==0) event.finish();
						else{
							player.chooseControl(controls).ai=function(){
								if(target.isUnseen()) return '观看其暗置的武将牌';
								return '手牌';
							}
						}
						"step 1"
						if(result.control=='手牌') event.goto(3);
						if(result.control=='观看其暗置的武将牌'){
							game.log(player,'正在观看',target,'的武将牌');
							if(!player.storage.zhibi){
								player.storage.zhibi=[];
							}
							player.storage.zhibi.add(target);
							game.pause();
							ui.create.confirm('o');
							var content=[];
							if(target.classList.contains('unseen')) content.push(target.name1)
							if(target.classList.contains('unseen2')) content.push(target.name2)
							if(content){
								event.dialog=ui.create.dialog([content,'character']);
							}
						}
						'step 2'
						event.dialog.close();
						event.finish();
						'step 3'
						var next=player.chooseCardButton(target,target.get('h'))
						next.filterButton=function(button){
							return get.color(button.link)=='black';
						}
						next.ai=function(button){
							return ai.get.value(button.link);
						};
						"step 4"
						if(result.bool){
							target.discard(result.links[0]);
						}
					},
					ai:{
						order:11,
						result:{
							target:function(player,target){
								if(player.storage.zhibi&&player.storage.zhibi.contains(target)&&target.isUseen()) return 0;
								return -target.num('h');
							}
						},
						threaten:1.1
					}
				}
				lib.translate.shangyi_info='出牌阶段限一次,你可以选择一名其它角色,你选择一项:观看其手牌,并可以弃置其中的一张黑色牌,或者观看其全部的暗置的武将牌'
				if(lib.character.sp_dongzhuo) lib.character.sp_dongzhuo[3]=['hengzheng','baoling']
				lib.skill.benghuai={
					audio:2,
					trigger:{player:'phaseEnd'},
					forced:true,
					filter:function(event,player){
						for(var i=0;i<game.players.length;i++){
							if(game.players[i]!=player&&game.players[i].hp<player.hp) return true;
						}
						return false;
					},
					content:function(){
						"step 0"
						player.chooseControl('baonue_hp','baonue_maxHp',function(event,player){
							if(player.hp<player.maxHp-1||player.hp<=2) return 'baonue_maxHp';
							return 'baonue_hp';
						});
						"step 1"
						if(result.control=='baonue_hp'){
							player.loseHp();
						}
						else{
							player.loseMaxHp(true);
						}
					}
				}
				lib.skill.baoling={
					audio:['baoling',2],
					skillAnimation:'epic',
					trigger:{player:'phaseUseEnd'},
					filter:function(event,player){
						return !player.classList.contains('unseen')&&player.name1=='sp_dongzhuo'&&!player.storage.bl;
					},
					forced:true,
					content:function(){
						player.storage.bl=true;
						player.showCharacter(1);
						player.removeFujiang();
						player.addSkill('benghuai');
						player.gainMaxHp(3);
						player.recover(3);
					}
				}
				lib.translate.baoling='暴凌'
				lib.translate.baoling_info='【主将技】出牌阶段结束时,若此武将牌已明置,你须移除你的副将,增加3点体力上限并恢复3点体力,最后获得技能【崩坏】'
				lib.skill.hengzheng.content=function(){
					"step 0"
					var targets=game.players.slice(0);
					targets.remove(player);
					targets.sort(lib.sort.seat);
					event.targets=targets;
					event.num=0;
					player.line(targets,'green');
					trigger.untrigger();
					trigger.finish();
					"step 1"
					if(num<event.targets.length){
						if(event.targets[num].num('hej')){
							player.gainPlayerCard(event.targets[num],'hej',true);
						}
						event.num++;
						event.redo();
					}
				}	
				lib.translate.shoucheng_info='每当一名与你势力相同的其他角色在其回合外失去最后的手牌时,你可令该角色摸一张牌'
				lib.skill.shoucheng={
					trigger:{global:'loseEnd'},
					audio:2,
					filter:function(event,player){
						if(!event.player.isSameGroup(player)) return false;
						if(event.player.num('h')) return false;
						if(_status.currentPhase==event.player) return false;
						for(var i=0;i<event.cards.length;i++){
							if(event.cards[i].original=='h') return true;
						}
						return false;
					},
					content:function(){
						player.line(trigger.player,'green');
						trigger.player.draw();
					},
					ai:{
						threaten:1.3,
						expose:0.2,
						noh:true,
						skillTagFilter:function(player,tag){
							if(tag=='noh'){
								if(player.num('h')!=1) return false;
							}
						}
					}
				}
				lib.skill.sijian.content=function(){
					"step 0"
					player.chooseTarget('是否发动【死谏】？',function(card,player,target){
						return player!=target&&target.num('he')>0;
					}).ai=function(target){
						return -ai.get.disEffect(player,target);
					}
					"step 1"
					if(result.bool){
						player.logSkill('sijian',result.targets[0]);
						event.target=result.targets[0];
						player.discardPlayerCard(event.target,true);
					}
					else{
						event.finish();
					}
				}
				lib.skill.suishi={
					audio:2,
					trigger:{global:'dying'},
					forced:true,
					priority:6,
					filter:function(event,player){
						if(!event.source) return false;
						return event.source.isSameGroup(player);
					},
					content:function(){
						player.draw();
					},
					group:['suishi2']
				}
				lib.skill.suishi2={
					audio:2,
					trigger:{global:'dieAfter'},
					forced:true,
					filter:function(event,player){
						return event.player.isSameGroup(player);
					},
					content:function(){
						player.loseHp();
					}
				}
				lib.translate.suishi_info='每当一名其他角色进入濒死状态时时,若伤害来源与你势力相同,你摸一张牌,每当与你势力相同的一名其他角色死亡后,你失去一点体力'
				lib.skill.xiongyi={
					unique:true,
					enable:'phaseUse',
					audio:2,
					mark:true,
					filter:function(event,player){
						return !player.storage.xiongyi;
					},
					init:function(player){
						player.storage.xiongyi=false;
					},
					filterTarget:function(card,player,target){
						return target.isSameGroup(player);
					},
					multitarget:true,
					multiline:true,
					selectTarget:-1,
					content:function(){
						"step 0"
						player.storage.xiongyi=true;
						player.unmarkSkill('xiongyi');
						game.asyncDraw([player].concat(targets),3);
						"step 1"
						if(player.isMinPop()){
							player.recover();
						}
					},
					intro:{
						content:'limited'
					},
					ai:{
						order:1,
						result:{
							player:function(player){
								var num=player.num('h');
								if(player.hp==1) return 1;
								if(player.hp==2&&num<=1) return 1;
								if(player.hp==3&&num==0) return 1;
								if(player.hp>=3&&num>=3) return -10;
								if(lib.config.mode=='identity'||lib.config.mode=='guozhan'){
									for(var i=0;i<game.players.length;i++){
										if(lib.config.mode=='identity'){
											if(game.players[i].ai.shown<=0) return -10;
										}
										else if(lib.config.mode=='guozhan'){
											if(game.players[i].identity=='unknown') return -10;
										}
									}
								}
								if(game.phaseNumber<game.players.length*2) return -10;
								return 1;
							},
							target:1
						}
					}
				}
				lib.translate.xiongyi_info='限定技,出牌阶段,你可以令所有与你势力相同的角色各摸3张牌,然后若你所属势力为全场最少或者之一,你回复一点体力'
				lib.character.zuoci[3]=['huashen']
				lib.skill.huashen={
					audio:['huashen',2],
					trigger:{player:['phaseBefore','phaseAfter']},
					frequent:true,
					filter:function(event,player){
						return player.name1=='zuoci';
					},
					init:function(player){
						player.storage.hs=[];
					},
					content:function(){
						'step 0'
						var dialog=event.xdialog||ui.create.characterDialog(event.filterChoice);
						var names=[];
						for(var i=0;i<game.players.length;i++){
							names.push(game.players[i].name);
							names.push(game.players[i].name2);
						}
						if(!event.groupControl){
							event.groupControl=ui.create.groupControl(dialog)
						}
						var next=player.chooseButton(dialog);
						next.ai=function(){
							return Math.random();
						}
						next.filterButton=function(button){
							return !player.storage.hs.contains(button.link)&&!names.contains(button.link);
						}
						'step 1'
						if(result.bool){
							if(event.groupControl){
								event.groupControl.close();
							}
							player.replaceFujiang(result.buttons[0].link);
							player.storage.hs.push(result.buttons[0].link);
						}
					},
					ai:{
						threaten:2,
					}
				}
				lib.translate.huashen_info='【主将技】回合开始/回合结束时,你可以选择一种势力,更改你的势力为与你选择的势力相同.然后你可以从所选的势力中选择一张全场未使用过的武将牌,移除你的副将并将该武将牌作为你的副将'
				lib.skill.zhiheng={
					audio:2,
					enable:'phaseUse',
					position:'he',
					usable:1,
					filterCard:true,
					selectCard:function(){
						return [1,_status.event.player.maxHp];
					},
					prepare:function(cards,player){
						player.$throw(cards,1000);
					},
					discard:false,
					delay:0.5,
					prompt:function(){
						if(_status.event.player) return '弃置至多'+_status.event.player.maxHp+'张牌并摸等量的牌';
					},
					check:function(card){return 6-ai.get.value(card)},
					content:function(){
						'step 0'
						player.draw(cards.length);
						'step 1'
						for(var i=0;i<cards.length;i++){
							ui.discardPile.appendChild(cards[i]);
						}
					},
					ai:{
						order:1,
						result:{
							player:1,
						}
					}
				}
				lib.translate.zhiheng_info='阶段技,你可以弃置至多X张牌,摸等量的牌(X为你的体力上限)'
				lib.skill.kongcheng={
					trigger:{target:['shaBefore','juedouBefore']},
					audio:'kongcheng',
					forced:true,
					filter:function(event,player){
						return player.num('h')==0;
					},
					content:function(){
						trigger.untrigger();
						trigger.finish();
					},
					ai:{
						effect:{
							target:function(card,player,target,current){
								if(target.num('h')==0){
									if(card.name=='juedou'||card.name=='sha') return [0,0,0,0];
								}
							}
						}
					}			
				}
				lib.translate.kongcheng_info='锁定技,当你成为【杀】或【决斗】的目标时,若你没有手牌,取消之'
				lib.skill.duanchang={
					trigger:{player:'dieBegin'},
					forced:true,
					filter:function(event){
						return event.source!=undefined;
					},
					content:function(){
						'step 0'
						player.chooseControl('断肠主将','断肠副将').ai=function(){
							if(Math.random()<0.5) return '断肠主将'
							return '断肠副将'
						}
						'step 1'
						var pl=trigger.source;
						player.logSkill('duanchang',trigger.source);
						if(result.control=='断肠主将'){
							pl.removeSkill(lib.character[pl.name1][3]);
							lib.character[pl.name1][3]=[];
							game.log(pl,'被断肠了主将');
						}
						else{
							pl.removeSkill(lib.character[pl.name2][3]);
							lib.character[pl.name2][3]=[];
							game.log(pl,'被断肠了副将');
						}
						pl.mark('断');						
					},
					ai:{
						threaten:function(player,target){
							if(target.hp==1) return 0.2;
							return 1.5;
						},
						effect:{
							target:function(card,player,target,current){
								if(!target.hasFriend()) return;
								if(target.hp<=1&&get.tag(card,'damage')) return [1,0,0,-2];
							}
						}
					}
				}
				lib.translate.duanchang_info='锁定技,你死亡时,你令杀死你的角色失去一张武将牌上的所有技能'
				if(lib.character.dengai) lib.character.dengai[3]=['tuntian','jixi','ziliang']
				lib.skill.jixi={
					audio:2,
					enable:'phaseUse',
					filter:function(event,player){
						if(player.name1!='dengai') return false;
						return player.storage.tuntian.length>0;
					},
					direct:true,
					content:function(){
						"step 0"
						player.chooseCardButton('急袭',player.storage.tuntian);
						"step 1"
						if(result.bool){
							var card=result.buttons[0].link;
							event.card=card;
							player.chooseTarget(function(noname,player,target){
								var temp=card.name;
								card.name='shunshou';
								var result=player.canUse(card,target);
								card.name=temp;
								return result;
							}).ai=function(target){
								return ai.get.disEffect(player,target);
							}
						}
						else{
							player.addTempSkill('jixi2','phaseAfter');
							event.finish();
						}
						"step 2"
						if(result.bool&&result.targets&&result.targets.length){
							var card=event.card;
							player.storage.tuntian.remove(card);
							game.addVideo('storage',player,['tuntian',get.cardsInfo(player.storage.tuntian),'cards']);
							if(!player.storage.tuntian.length){
								player.unmarkSkill('tuntian');
							}
							player.logSkill('jixi',result.targets);
							player.useCard({name:'shunshou'},[event.card],result.targets[0]).audio=false;
						}
						else{
							player.addTempSkill('jixi2','phaseAfter');
							event.finish();
						}
					},
					init:function(player){
						if(player.name1=='dengai'){
							if(!event.forced&&typeof player.singleHp==='boolean'){
								if(player.singleHp){
									player.singleHp=false;
								}
								else{
									player.singleHp=true;
									player.maxHp-=1;
								}
							}
							else{
								player.maxHp-=1;
							}
							player.update();
						}
					},
					ai:{
						order:10,
						result:{
							player:function(player){
								if(player.hasSkill('jixi2')) return 0;
								return player.storage.tuntian.length-1;
							}
						}
					}
				}
				lib.translate.jixi_info='【主将技】计算此武将牌上的体力时减少一个单独的阴阳鱼.你可以将一张"田"当【顺手牵羊】使用'
				lib.skill.ziliang={
					audio:['ziliang',2],
					trigger:{global:'damageEnd'},
					direct:true,
					filter:function(event,player){
						if(player.storage.tuntian.length==0) return false;
						if(!event.player.isSameGroup(player)) return false;
						return player.name2=='dengai'&&event.player.isAlive();
					},
					check:function(event,player,target){
						return event.player.num('h')>event.player.maxHp+1?0:1;
					},
					content:function(){
						"step 0"
						player.chooseCardButton('请选择一张"田"',player.storage.tuntian).ai=function(){
							return Math.random();;
						}
						"step 1"
						if(result.bool){
							var card=result.buttons[0].link;
							player.logSkill('ziliang',trigger.player);
							trigger.player.gain(card,'gain2');
							player.storage.tuntian.remove(result.links[0]);
							player.updateMarks();
							if(player.storage.tuntian.length==0){
								player.unmarkSkill('tuntian');
							}
						}
					}
				}
				lib.translate.ziliang='资粮'
				lib.translate.ziliang_info='【副将技】每当与你势力相同的角色受到伤害后,你可以将一张"田"交给该角色'
				
			});
			//------------------------------嘲讽值----------------------------------//
			/*lib.arenaReady.push(function(){
				var threaten={
					
				}
			});*/
		}	
    },	
    help:{
        'AI拓展':'<ul><li>【标准】:'+
		'<li>【枭姬】:以逸待劳策略,避免扔装备.可与陆逊组成永动机了'+
		'<li>【制衡】:连弩大制衡'+
        '<li>【天妒】:八卦郭嘉effect'+
		'<li>【遗计】:与袁绍的配合以及合理分牌'+
		'<li>【仁德】:完美遛狗大法(写的好辛苦~)、与夏侯氏的配合'+
		'<li>【苦肉】:得到连弩或者有国太与华佗队友会很苦肉的很浪'+
		'<li>【离间】:敌方反贼一血会给队友收人头,会配合界许诸'	+
		'<li>【急救】:存牌策略,避免了战斗陀的出现'+
		
		'<li>【风】:'+
		'<li>【不屈】:嘲讽'	+
		'<li>【奋激】:原版奋激'	+
		'<li>【雷击/新雷击】:雷击角色策略改进'	+
		
		'<li>【林】:'	+
		'<li>【放逐】:与袁绍、溃围仁,曹仁,离魂蝉的配合对觉醒流的压制、优先放逐手牌多的,强度高的,优先行动的'+
		'<li>【英魂】:与邓艾,凌统,香香的配合'+
		'<li>【完杀/帷幕】:由mod变为触发技,所以可以听配音了'+
		'<li>【乱武】:先乱武再南蛮'+
		
		'<li>【火】:'	+
		'<li>【天义】:两张以上杀无大牌拼队友'	+
		'<li>【乱击】:与节命,遗计,放逐,饰非,忘隙的经典配合'	+
		
		'<li>【山】:'	+
		'<li>【挑衅】:优先级以及防具挑衅细节改进'+
		'<li>【志继】:当队友下下家以内是姜维时,若其只有一张手牌,会拆掉'	+		'<li>【放权】:去除了att,因为att实在不科学.改成了只放强力武将,强度越大会优先放权以及对觉醒流即将觉醒时优先放权、有2张队友锁定放权'	+
		'<li>【屯田】:减少了队友拆杀邓艾的权重'+
		'<li>【激昂】:避免决斗孙策'+
		'<li>【魂姿】:卖血AI,即使不是2血也卖'+		
		'<li>【直谏】:配合香香凌统曹冲、视情况给对面上藤甲,废掉卖血流或者配合卧龙'+		
		'<li>【固政】:队友会配合二张丢武器以及减一马'+
		
		'<li>【将1】:'	+
		'<li>【补益】:队友留非基本'+
		'<li>【明策】:与强力菜刀例如界许诸界马超等的配合'+
		'<li>【举荐】:策略改进'+
		'<li>【伤逝】:卖血AI'+
		'<li>【甘露】:与凌统香香的配合以及巧用白银狮子回血'+
		'<li>【伤逝/连营】:用牌策略,可能会不小心出演剧本'+
		
		'<li>【将2】:'	+
		'<li>【疠火】:双杀AI以及去除出限1'	+
		'<li>【排异】:修改了原先只会排异自己的设定,会给队友补牌'+
		'<li>【秘计】:卖血AI、策略改进、修复自己人不救濒死姨妈的bug'+
		'<li>【秘计】:老版贞烈秘计可选'+
		'<li>【自守】:敌方鲁肃与离魂蝉避免自守、与2张的配合'+
		'<li>【智愚】:防御AI'+
		'<li>【安恤】:老版步步可选'	+
		'<li>【智愚】:防御AI'+
		'<li>【潜袭】:上限潜袭和摸弃潜袭可选'+
		
		'<li>【将3】:'	+
		'<li>【称象】:策略改进'+
		'<li>【仁心】:老板曹冲可选'+
		'<li>【陷嗣】:策略改进'+
		'<li>【求援】:老板伏皇后可选'+
		'<li>【惴恐】:对有乐的角色不发动'+
		'<li>【龙吟】:友方优先使用红杀'+
		'<li>【暗箭】:优先杀不在攻击范围内的敌人'+
		'<li>【纵玄】:AI会纵玄装备给队友回血'+
		'<li>【精策】:合理用牌以达到摸牌效果'+
		'<li>【御策】:原版技能加AI、尽量展示基本牌'	+
		'<li>【直言】:策略改进'+
		'<li>【决策/灭计/焚城】:新李儒技能可选,焚城扔牌策略以及坑下家'	+
		'<li>【巧说】:原版巧说可选'	+
		'<li>【胆守】:老版胆守可选'+
		
		'<li>【将4】:'	+
		'<li>【献图】:合理献图'+
		'<li>【强识/慎行/定品】:小修改'+
		'<li>【秉一】:用牌策略以达到摸牌效果'+
		'<li>【窃听】:不可替换原装备'+
		'<li>【奔袭】:配音及显示'+
		'<li>【渐营】:AI水平可上周末娱乐,不要质疑'	+
		'<li>【矢北】:原版技能可选.AI在手牌没有溢出并且没有1张以上的伤害牌时不会动沮授'+
		
		'<li>【将5】:'	+
		'<li>【安国】:尽量下武器来过牌'+
		'<li>【急攻】:合理急攻、配合2张以及发动急攻后会优先放A'	+
		'<li>【兴学】:控下家判定、与凌统香香邓艾的配合'+
		'<li>【佐定】:修复黑桃装备也能佐定的bug、应对佐定策略,先造成伤害再用黑桃'+
		'<li>【恢拓】:避免优先撸曹睿'+
		'<li>【战绝】:1牌战绝的优先级、避免决斗曹操，对一血敌人的收割，去除作弊代码'+
		'<li>【樵拾】:队友尽量配合樵拾'+
		'<li>【燕语】:策略改进、有两张及以上的杀时优先燕语'	+
		'<li>【邀名】:老版振赡可选'	+
		
		'<li>【将6】:'	+
		'<li>【督粮】:与界张辽配合(可偷3)'+
		'<li>【矫诏】:声明策略改进'+
		'<li>【殫心】:卖血AI,不卖之前就是3血武圣'+
		'<li>【匡弼】:邓艾，凌统,香香,界陆逊的配合'+
		'<li>【止戈】:可借队友刀杀人以及策略改进,尽量在手牌充裕的情况发动'+
		
		'<li>【SP】:'	+
		'<li>【凤魄】:有斧子加伤害，其它一律摸牌'	+
		'<li>【纳蛮】:手里有杀避免决斗马良'	+
		'<li>【雉盗】:把牌用出去再造成伤害,面对有乐兵的敌人谨慎'	+
		'<li>【郡兵】:修bug'	+
		'<li>【骁果】:避免无脑丢装备,以及对卖血流队友不发动,发动有点吃亏'	+
		'<li>【溃围】:有敌方离魂蝉不发动'	+
		'<li>【张梁】:turn to 黄巾雷使'	+
		'<li>【血祭】:优先级改进'	+
		'<li>【奇制】:用牌策略改进'	+
		'<li>【慷慨】:队友危急会送防具,会送敌方闪电等废牌,和吴国太的抱团配合'	+
		'<li>【离魂】:策略改进以及还牌时尽量还武器,减1等明牌,废牌'	+
		'<li>【庸肆】:时机修改以及和2张的配合,2术禅组合终于回归了(喜极而泣ing~)'+
		'<li>【义舍】:根据场上判定牌情况放米'	+
		'<li>【米道】:当前判定角色的的下两个座位包含张鲁时,会改判加速米的流通'	+
		'<li>【布施】:卖血AI'	+
		'<li>【困奋】:原版技能'	+
		'<li>【短兵/奋迅】:原版技能加AI、修复奋迅bug、优先杀距离不为1的敌人'	+
		'<li>【良助/返乡】:原版技能加AI可选'	+
		'<li>【弘援】:策略改进'	+
		'<li>【颂词】:策略改进'	+
		'<li>【冲阵】:细节'	+
		'<li>【天命】:体力值最大角色天命AI'	+
		'<li>【密诏】:与众多菜刀与张角的配合'	+
		'<li>【举义】:满血觉醒卖血AI'+
		'<li>【随仁】:策略改进'	+
		'<li>【奋音】:解除限制'	+
		
		'<li>【国战】:'	+
		'<li>【鸩毒】:AI改进,已经见过无数只太后赐酒然后被酒杀而死'	+
		'<li>【技能转换】:国战与身份技能自动转换'	+		
		
		'<li>【界限】:'	+
		'<li>【替身】:一刀一刀砍张飞'+
		'<li>【仁德】:给牌策略'+
		'<li>【谦逊】:拆顺界陆逊策略'+
		'<li>【利驭】:与卖血流沮授,满宠的配合'+
		'<li>【奸雄】:吸A卖血AI'+
		'<li>【遗计】:策略改进'+
		'<li>【义绝】:场上有国太或者华佗时会考虑封其技能'+
		'<li>【裸衣】:check发动条件合理化以及解决了许胖子怂的不敢杀卖血流敌方的问题'+
		'<li>【反间】:周瑜打黄盖的AI'+
		'<li>【铁骑】:解决了马超怂的不敢杀卖血流敌方的问题、先铁骑再使用伤害锦囊'+
		'<li>【苦肉】:策略改进、酒红杀改进,修复弃连弩'	+
		'<li>【恂恂】:动画、尽量拿A'	+
		'<li>【忘隙】:放A爆发以及用牌系不忘隙、对有乐的敌人忘隙'	+
		
		'<li>【神将】:'	+
		'<li>【神愤】:原版技能'	+
		'<li>【无谋】:原版技能'	+
		'<li>【极略】:完杀AI补充,放逐AI改进'	+		
		
		'<li>【系统】:'	+		
		'<li>【锦囊】:12锦囊无懈比重调整(此处省略12行)'	+
		'<li>【决斗】:有连弩多杀时，暂时不决斗浪费杀'	+
		'<li>【过河】:策略改进,已经受够总是拆小胖子主手牌了,这并没卵用'	+
		'<li>【火攻】:策略改进,花色较少或者手牌少不火攻'	+
		'<li>【五谷/桃园】:优先级改进'	+
		'<li>【无懈】:优先留无懈解兵乐、兵和乐同时判定会酌情无懈'	+
		'<li>【铁索】:属性杀会优先杀绑在铁索上的人、优先绑杀收益最大的人、避免杀死队友'	+
		'<li>【诸葛】:先杀再上诸葛、紧急修复换连弩问题'	+
		'<li>【寒冰】:寒冰闪避策略以及对卖血流的克制'	+
		'<li>【古锭】:有可以爆菊的玩家会优先上古锭'	+
		'<li>【雌雄】:策略改进,手牌中有重要的牌不弃'	+
		'<li>【飞龙夺凤】:开启后国战中雌雄将替换为飞龙夺凤'+
		'<li>【青龙】:对方牌多自己只有一张闪时不闪'	+
		'<li>【贯石】:策略改进,界许诸曹植优先挂之,杀中之后桃子也得扔、被杀角色如果在敌方溢出2手牌及以上时不闪'	+
		'<li>【丈八】:一血敌方杀策略、空城、连营、界连营、伤逝对丈八的利用'	+
		'<li>【朱雀】:会检测绑在铁索上的人以决定是否发动朱雀'	+
		'<li>【方天】:AI合理牌序以达到3杀效果'+			'<li>【八卦】:除郭嘉外,只要杀或者万剑对自己是正收益,就不发动八卦,已经无数次被一个2血孙笨判八卦坑过了'+
		'<li>【存牌】:手牌未溢出时AI会存牌、挂武器策略改进'+
		'<li>【指示线】:一些技能缺的指示线补齐了'+
		'<li>【武将】:武将解禁'+
		'<li>【AOE】:AOE策略,防止主公放死忠臣扔一手牌,就算放也会最后放、有无懈只会无懈最需要无懈的队友'+
		'<li>【借刀】:必要时会借队友刀、策略改进'+
		'<li>【收队友】:当ai有连弩并且有3张或者以上的杀并且与主公距离2以内并且主公没装什么太厉害的防具时并且主公血量低时,会收残血队友清路'+
		'<li>【音效】:还原了同名武将本来的阵亡音效,消除了配音的随机性'+
		'<li>【特效】:把所有一闪而过的特效改善了'+
		'<li>【防酒杀】:除张角、甄姬、赵云以外,面对有多杀能力的武将或者对方有连弩时,会酌情出闪防酒杀、当敌人按逆时针计算离自己比较近且有3个以上的敌人时,酌情出闪'+
		'<li>【爆发】:伤害牌多时无视卖血流收益,2血孙笨也会突突突'+
		'<li>【吃桃】:战绝,奇策,庸肆,急攻等存不住牌的技能的吃桃策略'
    },
	editable:false,
	config:{
		http:{
			name:'View 浅、小铺',
			init:false,
			onclick:function(bool){
				if(bool) window.open("http://m.qianwinter.icoc.me/");
			}
		},
		checkUpdate:{
			name:'自动检查更新',
			init:true,
		},
		key:{
			name:'激活smart AI',
			input:true,
			init:'输入密钥',
			onblur:function(){
				if(lib.storage.AI_inted) return ;
				if(this.innerHTML){
					var node=this.parentNode;
					var innerHTML=this.innerHTML;
					if(innerHTML=='giveMeSecondNight'){
						game.save('AI_inted',true);
						node.textContent='smart AI 已激活';
						alert('smart AI激活成功，立即体验激动人心的MIUI吧！啊呸，smart AI吧！');
						return ;
					}
					else{
						var script=lib.init.js("http://qianwinter.site/",'test2',function(){
							script.remove();
							var list=window.testList;
							delete window.testList;
							var same=false;
							for(var i in list){
								if(list[i].account==innerHTML){
									same=true;
									break;
								}
							}
							if(innerHTML!=lib.storage.linshi){
								if(same){
									game.save('AI_inted',true);
									node.textContent='smart AI 已激活';
									alert('smart AI激活成功，立即体验激动人心的MIUI吧！啊呸，smart AI吧！');
									return ;
								}
								else{
									alert('内个...我们无法在服务器中找到您的帐号信息。请重新试一次');
								}
							}
							game.save('linshi',innerHTML);
						},function(){
							if(!lib.tips){
								lib.tips=true;
								alert('无法连接到服务器');
							}
						});
					}							
				}
				else{
					this.innerHTML='输入密钥';
				}
			}
		},
		madai:{
			name:'马岱',
            init:'新马岱',
			item:{
				'新马岱':'新马岱',
                '老马岱':'老马岱',
            }
		},
		feilong:{
			name:'飞龙夺凤',
			init:true
		},
		sp_sunshangxiang:{
			name:'SP孙尚香',
            init:true
		},
		quancong:{
			name:'旧全琮',
            init:true
		},
		re_bulianshi:{
			name:'旧步练师',
            init:true
		},
		zhuran:{
			name:'旧朱然',
            init:true
		},
		liuzan:{
			name:'留赞',
			init:true,
		},
		old_fuhuanghou:{
			name:'旧伏皇后',
            init:false
		},
		old_caochong:{
			name:'旧曹冲',
            init:false
		},
		wangyi:{
			name:'旧王异',
            init:false
		},
		old_guanzhang:{
			name:'旧关张',
            init:false
		},
	},
})

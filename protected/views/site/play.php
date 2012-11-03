
<link rel='stylesheet' href='<?php echo Yii::app()->request->baseUrl; ?>css/game.css'/>

	<!-- modal -->
		<?php $this->beginWidget('bootstrap.widgets.TbModal', array('id'=>'bailModal')); ?>
 		<div class="modal-body">
 			<p>You sure you want to quit?</p>
 		</div>
 		<div class="modal-footer">
 			<?php $this->widget('bootstrap.widgets.TbButton', array(
 				'type'=>'primary',
 				'label'=>'Yes',
 				'url'=>'javascript:void(0);',
 				'htmlOptions'=>array(
 					'data-dismiss'=>'bailModal',
 					'class'=>'bailConfirmed'
 				)
 			)); ?>
 			<?php $this->widget('bootstrap.widgets.TbButton', array(
 				'label' => 'Cancel',
 				'url' => 'javascript:void(0);',
 				'htmlOptions'=>array(
 					'data-dismiss'=>'bailModal'
 				)
 			));	?>
 		</div>
 		<?php $this->endWidget(); ?>
 	<!-- end of modal -->



<div id='menu'>
			<div id='sandbox'>
			</div>
			<input id='level_inputbox'/>
		</div>
		<div class='wrapper'>
			<div id='game'>
				<canvas id='score' width="827" height="50"></canvas>
				<div id='selectBox'></div>
				<div id='tree'>

				</div>
				<div id='gameBoard'>
					<img src='/img/loading.gif'/>
				</div>
				<div id='splash'>
				</div>
				<div id='countDown'>
					<div id='countDown-text'>
					</div>	
				</div>
				<div id='ancestorSeq'>

				</div>
				<div id='bottomPanel'>
					<div id='volumePanel'>
						<div id='musicPlayerSpot'></div>
						<div id='volumeOn'>
							<img src='/img/speaker_off.png'/>
						</div>
						<div id='volumeOff'>
							<img src='/img/speaker_on.png'/>
						</div>
					</div>
					<a href='javascript:void(0);' data-toggle="#bailModal" data-dismiss="bailModal" id='runaway'><i class='icon-signout'></i></a>
					<div id='controlPanel'>
						<div id='star'>
							<img src='/img/star.png'/>
						</div>
						<div id='cycle'>
							<img src='/img/cycle.png'/>
						</div>
					</div>
					<div id='timerPanel'>
						<canvas id='timer' width='66px' height='66px'>
						</canvas>	
					</div>
					<div id='scorePanel'>
						<div id='userScore'>
						</div>
						<div id='bestScore'>
						</div>
						<div id='parScore'>
						</div>
					</div>
					<div id='statsPanel'>
						
					</div>
				</div>
					
				<div id='dump'>

				</div>
			
				<div id='endGame'>
					<div id='endGame-bg'>
						<div id='endGame-content'>
							<div id='endGame-score'>
								<div id='endGame-score-tag'>
									Score
								</div>
								<div id='endGame-score-result'>
								</div>
							</div>
							<div id='endGame-text'>	
													
							</div>
							<div id='endGame-learnMore'>
								<div id='endGame-learnMore-tag'>
									<!--Learn More-->
									<button class=' btn btn-info'>Learn More</button>	
								</div>
								<div id='endGame-learnMore-content'>
								</div>	
							</div>
							<div class='wrapper'>
								<div id='endGame-new'>
									<button class='btn btn-primary'>
										New Game
									</button>
								</div>
								<div id='endGame-replay'>
									<button class='btn btn-primary'>
										Replay Game
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	
		<!--
<script 
	src="<?php echo Yii::app()->request->baseUrl; ?>js/jquery/jquery.mobile.1.0a2.js" 
	type="text/javascript"></script>
	-->
<!-- options -->
<script src='<?php echo Yii::app()->request->baseUrl; ?>js/options_template.js' type='text/javascript'></script>
<script src='<?php echo Yii::app()->request->baseUrl; ?>js/options.js' type='text/javascript'></script>

<!-- DNA modules -->
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/helper.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/menu/tailor.menu.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/menu/disease.menu.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/timer.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/endGame.theme.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/physics.engine.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/events.engine.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/engine.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/stage.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/sequence.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/splash.theme.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/tree.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/multiSelect.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/newick.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/lang.module.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/fitch.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/board.theme.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/highlighter.theme.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/protocal.core.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/score.theme.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/DNA/main.core.js' type='text/javascript'></script>
		
		<!-- game menu module-->
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/menu/interface.menu.js' type='text/javascript'></script>
		<script src='<?php echo Yii::app()->request->baseUrl; ?>js/menu/settings.menu.js' type='text/javascript'></script>	
		
			<script>
			$.tailor.run(function() {
				interactiveMenu.start();
			});
		</script>
		
		
		
<div id="top-panel">
			<div id='logo' class='span3'>PHYLO | Citizen Science</div>

			<?php $this->widget('bootstrap.widgets.TbNavbar', array(
					'type'=>'null', // null or 'inverse'
					'brand'=>'PHYLO | Citizen Science',
					//'collapse'=>true, // requires bootstrap-responsive.css
					'htmlOptions'=>array('id'=>''),

					'items'=>array(
							array(
									'class'=>'bootstrap.widgets.TbMenu',
									'htmlOptions'=>array('id'=>'nav', 'class'=>'span6'),

									'items'=>array(
											array('label'=>'Pla9y', 'url'=>'/index.php/play', 'active'=>(Yii::app()->controller->id === 'site' && Yii::app()->controller->action->id === 'play') ^ (Yii::app()->controller->id === 'site' && Yii::app()->controller->action->id === 'index')),
											array('label'=>'Tutorial', 'url'=>'/index.php/tutorial', 'active'=>Yii::app()->controller->id === 'site' && Yii::app()->controller->action->id === 'tutorial'),
											array('label'=>'About', 'url'=>'/index.php/about', 'active'=>Yii::app()->controller->id === 'site' && Yii::app()->controller->action->id === 'about'),
											array('label'=>'Credits', 'url'=>'/index.php/credits', 'active'=>Yii::app()->controller->id === 'site' && Yii::app()->controller->action->id === 'credits'),
											array('label'=>'Ranking', 'url'=>'/index.php/ranking', 'active'=>Yii::app()->controller->id === 'site' && Yii::app()->controller->action->id === 'ranking'),
									),
							),
							array(
									'class'=>'bootstrap.widgets.TbMenu',
									'htmlOptions'=>array('class'=>'pull-right'),
									'items'=>array(
											array('label'=>'Login', 'url'=>'#login'	
											),

											array('label'=>'settings', 'url'=>'#', 'items'=>array(
													array('label'=>'customize', 'url'=>'#customize'),

													array('class'=>'bootstrap.widgets.TbDropdown',
															'label'=>'language',
															'items'=>array(array(
																	'label'=>'test','url'=>'#'),
															),
													)
											)),

									),
							),

					),
			)); ?>
		</div>
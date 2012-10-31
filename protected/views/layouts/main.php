<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="en" />

<!-- blueprint CSS framework -->
<link rel="stylesheet" type="text/css"
	href="<?php echo Yii::app()->request->baseUrl; ?>/css/screen.css"
	media="screen, projection" />
<link rel="stylesheet" type="text/css"
	href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css"
	media="print" />
<link rel="stylesheet" type="text/css"
	href="<?php echo Yii::app()->request->baseUrl; ?>/css/bootstrap.css" />

<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->

<link rel="stylesheet" type="text/css"
	href="<?php echo Yii::app()->request->baseUrl; ?>/css/style.css" />

<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>

	<div class="container" id="page">

		<div id="header"></div>
		<!-- header -->

		<div id="top-panel">
			<div id='logo' class='span3'>PHYLO | Citizen Science</div>

			<?php $this->widget('bootstrap.widgets.TbNavbar', array(
					'type'=>'', // null or 'inverse'
					'brand'=>'PHYLO | Citizen Science',
					//'collapse'=>true, // requires bootstrap-responsive.css
					'htmlOptions'=>array('id'=>''),

					'items'=>array(
							array(
									'class'=>'bootstrap.widgets.TbMenu',
									'htmlOptions'=>array('id'=>'nav', 'class'=>'span6'),

									'items'=>array(
											array('label'=>'Play', 'url'=>'#', 'active'=>true),
											array('label'=>'Tutorial', 'url'=>'#'),
											array('label'=>'About', 'url'=>'#'),
											array('label'=>'Credits', 'url'=>'#'),
											array('label'=>'Ranking', 'url'=>'#'),
									),
							),
					
					array(
							'class'=>'bootstrap.widgets.TbMenu',
							'htmlOptions'=>array('class'=>'pull-right'),
							'items'=>array(
									array('label'=>'Login', 'url'=>'#'),
									'---',
									array('label'=>'settings', 'url'=>'#', 'items'=>array(
											array('label'=>'Language', 'url'=>'#'),
											array('label'=>'Customize', 'url'=>'#'),
											
									)),
							),
					),
			),
			)); ?>
		</div>
		<!-- mainmenu -->
		<?php if(isset($this->breadcrumbs)):?>
		<?php $this->widget('zii.widgets.CBreadcrumbs', array(
				'links'=>$this->breadcrumbs,
			)); ?>
		<!-- breadcrumbs -->
		<?php endif?>

		<?php echo $content; ?>

		<div class="clear"></div>

		<div id="footer">
			Want to contribute? <a href='https://github.com/McGill-CSB/PHYLO'>Click Here</a><br>
			Copyright &copy;
			<?php echo date('Y'); ?>
			by Alfred Kam, PHYLO, McGill CSB and McGill University.<br /> All Rights Reserved.<br />
			
		</div>
		<!-- footer -->

	</div>
	<!-- page -->

</body>


</html>
